const removeVariacoesDeLetras = (word) => {
    let letras = [...word]
    for (let w = 0; w < letras.length; w++ ){
        if(['é', 'ê'].indexOf(letras[w]) >= 0) letras[w] = "e"
        if(['ú', 'ù'].indexOf(letras[w]) >= 0) letras[w] = "u"
        if(['í', 'î'].indexOf(letras[w]) >= 0) letras[w] = "i"
        if(['ó', 'ô', 'õ'].indexOf(letras[w]) >= 0) letras[w] = "o"
        if(['á', 'à', 'ã', 'â'].indexOf(letras[w]) >= 0) letras[w] = "a"
        if(letras[w] === 'ç') letras[w] = "c"
    }
    console.log(letras)
    const wordFormatada = letras.join('')
    return wordFormatada
}

const newGame = (wordlist) => {
    let randomIndex = Math.floor(Math.random()*wordlist.length)
    let secret = wordlist[randomIndex]
    console.log(secret)
    return secret
}

const charCheck = (word, i) => {
    let word_ = removeVariacoesDeLetras(word)
    let secret_ = removeVariacoesDeLetras(secret)
    console.log(secret_)
    const attempt = word[i]
    if (secret_[i] === attempt)
        return "🟩"
    if (secret_.includes(attempt))
        return "🟨"
    return "⬛"
}

  modules.export = { removeVariacoesDeLetras, newGame, charCheck}