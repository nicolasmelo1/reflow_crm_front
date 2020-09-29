const isAdmin = (profilesType, userObject) => {
    if (profilesType && userObject) {
        // HINT: Just some hint here that i was not aware of and i think it's important to share
        // when i created this line below first i implemented it as profilesType.filter(profile=> profile.id = userObject.profile)
        // without realizing i set a single `=` i was not aware that a .filter() could assign a value, but guess what, it can.
        const userProfile = profilesType.filter(profile=> profile.id === userObject.profile)
        if (userProfile.length > 0 && userProfile[0].name === 'admin') {
            return true
        }
    }
    return false
}

export default isAdmin
