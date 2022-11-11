function categoryAbbrev(category) {
    if (typeof category !== 'string') {
        return ' '
    }
    return category.slice(0,3).toUpperCase()
}

module.exports = {categoryAbbrev}
