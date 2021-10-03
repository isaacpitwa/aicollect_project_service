const ObjectId = require('mongodb').ObjectID;

const questionaireschema = {
    _id:1,
    createdAt:1,
    isDeleted:1,
    isActive:1,
    addedBy:1,
    questionaires:{
        _id:1,
        formjson:1,
        title:1
    }
}


//completed jobs
const filterQuestionaires = function (and:any) {
    console.log(ObjectId(and[0].projectid))
    return [
        {
            $match: { 
                projectid : ObjectId(and[0].projectid),
            }
        },
        {
            $lookup:{
                from:"questionaires",
                localField:'questionaireid',
                foreignField:"_id",
                as:"questionaires"
            }
        },
        {
            $project:questionaireschema
        },
    ];
}

const filterQuestionairesWithModules = function (and:any) {
    return [
        {
            $match: { 
                projectid : ObjectId(and[0].projectid),
                moduleid :  ObjectId(and[0].moduleid) ,
            }
        },
        {
            $lookup:{
                from:"questionaires",
                localField:'questionaireid',
                foreignField:"_id",
                as:"questionaires"
            }
        },
        {
            $project:questionaireschema
        },
    ];
}

const filterMandatoryQuestionairesWithModules = function (and:any) {
    return [
        {
            $match: { 
                projectid : ObjectId(and[0].projectid),
                moduleid :  ObjectId(and[0].moduleid) ,
                ismandatory: true
            }
        },
        {
            $lookup:{
                from:"questionaires",
                localField:'questionaireid',
                foreignField:"_id",
                as:"questionaires"
            }
        },
        {
            $project:questionaireschema
        },
    ];
}

const filterMandatoryQuestionaires = function (and:any) {
    return [
        {
            $match: { 
                projectid : ObjectId(and[0].projectid),
                ismandatory: true
            }
        },
        {
            $lookup:{
                from:"questionaires",
                localField:'questionaireid',
                foreignField:"_id",
                as:"questionaires"
            }
        },
        {
            $project:questionaireschema
        },
    ];
}


const aggregations =  {
    filterQuestionaires:filterQuestionaires,
    filterQuestionairesWithModules:filterQuestionairesWithModules,
    filterMandatoryQuestionairesWithModules:filterMandatoryQuestionairesWithModules,
    filterMandatoryQuestionaires:filterMandatoryQuestionaires
}

export default aggregations;