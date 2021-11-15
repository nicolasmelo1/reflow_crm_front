import RepresentationService from '../shared/services/representation'

const main = async () => {
    const representationService = new RepresentationService('number', {},  {
        type: 'currency',
        labelName: 'Monetário',
        precision: 100,
        base: 1,
        prefix: null,
        suffix: null,
        thousandSeparator: '.',
        decimalSeparator: ','
    })

    representationService.representation('1892739812')
}
