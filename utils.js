exports.createStudent = (body,students) => {
    let [nameBody, ageBody] = decodeURIComponent(body).split('&')
    console.log(decodeURIComponent(body))
    let name = nameBody.split('=')[1]

    if(name.includes('+')){
        name = name.split('+').join(" ")
    }
    const birth = ageBody.split('=')[1]
    const id = students[students.length-1].id + 1
    return {id,name ,birth}
} 


exports.formatDate = (date) => {
    const dayjs = require('dayjs')
    require('dayjs/locale/fr')
    const localization = require('dayjs/plugin/localizedFormat')
    const utf8 = require('utf8')
    dayjs.extend(localization)
    dayjs.locale('fr')

    return dayjs(date).format("LL");
}
