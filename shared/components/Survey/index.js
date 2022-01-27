import React from 'react'
import { View } from 'react-native'
import axios from 'axios'
import agent from '../../utils/agent'
import { strings } from '../../utils/constants'
import Styled from './styles'


/**
 * Survey is a special component inside of reflow for taking and displaying surveys inside of reflow.
 * The idea is that besides tracking the user sometimes we need to ask stuff for the user like how he would feel
 * if the product didn't exist, how he would rate the product or what is the probability for recommending the product
 * for other people.
 * 
 * @param {number} surveyId - The id of the survey to be displayed.
 * @param {function} onCloseSurvey - Callback function to be called when the survey is closed.
 */
class Survey extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasOpenQuestions: false,
            survey: {
                id: null,
                survey_questions: [],
                survey_name: "",
                does_display_survey_name: false,
            },
            answer: {
                survey_question_answers:[]
            }
        }
    }

    setSurveyAndHasOpenQuestions = (survey, hasOpenQuestions) => {
        this.setState({
            ...this.state,
            hasOpenQuestions: hasOpenQuestions,
            survey: survey
        })
    }

    setAnswer = (answer) => {
        this.setState({
            ...this.state,
            answer: {...answer}
        })
    }

    /**
     * Checks if the options are from the likert scale
     * Reference: https://www.google.com/search?q=likert+scale&bih=944&biw=1872&hl=pt-BR&sxsrf=AOaemvKC6O_QB_fmJ1Td-K7fndCNw75jxA%3A1636512560848&source=hp&ei=MDOLYYHHMb_S1sQPxNKCgA0&iflsig=ALs-wAMAAAAAYYtBQB8Hz_Mju5xZajEWk6Du5SI94iUK&oq=liker&gs_lcp=Cgdnd3Mtd2l6EAMYADIECCMQJzILCAAQgAQQsQMQgwEyBQgAEIAEMgUIABCABDIFCAAQywEyCAgAEIAEELEDMgQIABBDMgUIABCABDIFCAAQgAQyBQgAEIAEOgcIIxDqAhAnOgYIIxAnEBM6DgguEIAEELEDEMcBEKMCOhEILhCABBCxAxCDARDHARDRAzoFCC4QgAQ6DgguEIAEELEDEMcBENEDOg4ILhCxAxCDARDHARCjAjoICC4QgAQQsQM6CAgAELEDEIMBOgoIABCxAxCxAxAKOhYILhCxAxCDARCxAxCxAxDHARDRAxAKOgQIABAKUK4EWLIQYO4daAFwAHgAgAH0AogBjAmSAQcwLjYuMC4xmAEAoAEBsAEK&sclient=gws-wiz
     * 
     * In simple words, likert scale is when you prompt the user: "On a rate from 1 to 10, how much do you like this?"
     * 
     * @param {number} questionId - The questionId to check if it is a likert scale.
     * 
     * @returns {boolean} - True if the question is a likert scale, false otherwise.
     */
    isQuestionInLikertScale = (questionId) => {
        const question = this.state.survey.survey_questions.filter(question => question.id === questionId)
        if (question.length > 0) {
            return question[0].survey_question_options.every(option => option.range_value !== null)
        }
        return false
    }

    /**
     * Checks if a given answer is the answer of a question.
     * 
     * @param {number} questionId - The id of the question that you wnat to check.
     * @param {string} answer - The answer that you want to check if this is the answer for the question
     * 
     * @returns {boolean} - True if the answer is the answer of the question, false otherwise.
     */
    isQuestionAnswer = (questionId, answer) => {
        return this.state.answer.survey_question_answers
            .filter(questionAnswer => questionAnswer.question_id === questionId && questionAnswer.value === answer).length > 0
    }

    /**
     * When the user answers a question, this function is called sending the questionId and the answer.
     * 
     * @param {number} questionId - The id of the question that was answered.
     * @param {Array<any>} answer - Array of data that will be the answer inserted in reflow.
     */
    onAnswerQuestion = (questionId, answer) => {
        const answeredQuestionIndex = this.state.answer.survey_question_answers.findIndex(question => question.question_id === questionId)
        
        if (answeredQuestionIndex === -1 && answer) {
            this.state.answer.survey_question_answers.push({
                question_id: questionId,
                value: answer
            })
        } else {
            this.state.answer.survey_question_answers[answeredQuestionIndex].value = answer
        }
        this.setAnswer(this.state.answer)
        this.checkIfAllQuestionsHadBeenAnsweredAndSubmit()
    }

    /**
     * Checks if all the questions of the survey have been answered and submit if it is the case.
     * 
     * If all of the questions haven't been answered, then wait till the user answer every question.
     */
    checkIfAllQuestionsHadBeenAnsweredAndSubmit = () => {
        if (this.state.hasOpenQuestions === false) {
            if (this.checkIfAllQuestionsHadBeenAnswered()) {
                this.onSubmit()
            }
        }
    }

    /** 
     * Checks if all of the given obligatory questions have been answered. 
     * 
     * @returns {boolean} - True if all of the obligatory questions have been answered, false otherwise.
     */
    checkIfAllQuestionsHadBeenAnswered = () => {
        let answeredQuestionIds = this.state.answer.survey_question_answers.map(question => question.question_id)

        for (const question of this.state.survey.survey_questions) {
            if (question.is_required) { 
                if (!answeredQuestionIds.includes(question.id)) {
                    return false
                }
            }
        }
        return true
    }
    /**
     * Submits the response to the server.
     */
    onSubmit() {
        agent.http.ANALYTICS.submitSurveyAnswer(this.state.survey.id, this.state.answer).then(response => {
            this.props.onCloseSurvey()
        })
    }

    componentDidMount() {
        this.source = axios.CancelToken.source()

        agent.http.ANALYTICS.retrieveSurvey(this.source, this.props.surveyId).then(response => {
            if (response && response.status === 200) {
                const hasOpenQuestions = response.data.data.survey_questions.filter(question => question.survey_question_options.length === 0).length > 0
                this.setSurveyAndHasOpenQuestions(response.data.data, hasOpenQuestions)
            }
        })
    }

    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <Styled.SurveyContainer>
                <Styled.SurveyBoxContainer>
                    <Styled.SurveyHeaderContainer>
                        <Styled.SurveyCloseButton onClick={(e) => this.props.onCloseSurvey()}>
                            x
                        </Styled.SurveyCloseButton>
                    </Styled.SurveyHeaderContainer>
                    {this.state.survey.does_display_survey_name ? (
                        <Styled.SurveyTitleContainer>
                            {this.state.survey.survey_name}
                        </Styled.SurveyTitleContainer>
                    ) : ''}
                    {this.state.survey.survey_questions.map((question, index) => (
                        <div key={question.id}>
                            <Styled.SurveyQuestion>
                                {this.state.survey.survey_questions.length > 1 ? `${index+1}. `: ''}{question.question}
                            </Styled.SurveyQuestion>
                            {question.survey_question_options.length > 0 ? (
                                <div>
                                    {this.isQuestionInLikertScale(question.id) ? (
                                        <Styled.SurveyLikertContainer>
                                            <Styled.SurveyLikertHeadersContainer>
                                                {question.survey_question_options.map((questionOption, index) => (
                                                    <Styled.SurveyLikertHeaderLabel
                                                    key={index}
                                                    >
                                                        {questionOption.option}
                                                    </Styled.SurveyLikertHeaderLabel>
                                                ))}
                                            </Styled.SurveyLikertHeadersContainer>
                                            <Styled.SurveyLikertScaleContainer>
                                                {Array.apply(
                                                    null, Array(
                                                        question.survey_question_options[question.survey_question_options.length-1].range_value
                                                        )
                                                ).map((_, index) => (
                                                    <Styled.SurveyLikertScaleButtons
                                                    key={index}
                                                    selected={this.isQuestionAnswer(question.id, (index+1).toString())}
                                                    onClick={() => this.onAnswerQuestion(question.id, (index+1).toString())}
                                                    >
                                                        {index+1}
                                                    </Styled.SurveyLikertScaleButtons>
                                                ))}
                                            </Styled.SurveyLikertScaleContainer>
                                        </Styled.SurveyLikertContainer>
                                    ) : (
                                        <Styled.SurveyQuestionOptionsContainer>
                                            {question.survey_question_options.map(questionOption => (
                                                <Styled.SurveyOptionContainer
                                                key={questionOption.id}
                                                selected={this.isQuestionAnswer(question.id, questionOption.option)}
                                                onClick={() => this.onAnswerQuestion(question.id, questionOption.option)}
                                                >
                                                    {questionOption.option}
                                                </Styled.SurveyOptionContainer>
                                            ))}
                                        </Styled.SurveyQuestionOptionsContainer>
                                    )}
                                </div>
                            ) : (
                                <Styled.SurveyTextInput 
                                onChange={(e) => this.onAnswerQuestion(question.id, e.target.value)}
                                type={'text'}
                                />
                            )}
                        </div>
                    ))}
                    {this.state.hasOpenQuestions ? (
                        <Styled.SurveySubmitButtonContainer>
                            <Styled.SurveySubmitButton 
                            disabled={!this.checkIfAllQuestionsHadBeenAnswered()}
                            onClick={() => {this.onSubmit()}}>
                                {strings['pt-br']['surveySubmitButtonLabel']}
                            </Styled.SurveySubmitButton>
                        </Styled.SurveySubmitButtonContainer>
                    ) : ''}
                </Styled.SurveyBoxContainer>
            </Styled.SurveyContainer>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default Survey