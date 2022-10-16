function addSlashes(str) {
    return (str + '').replace(/[\\"']/g, '').replace(/\u0000/g, '');
}

function tiraArroba(nome) {
    if (nome.charAt(0) === '@') return nome.substring(1);
    return nome;
}

module.exports = {
    addSlashes,
    tiraArroba
}