const ObjectId = require('mongodb').ObjectID;

const questionaireschema = {
    _id:1,
    createdAt:1,
    isDeleted:1,
    isActive:1,
    addedBy:1,
    tag:1,
    questionaires:{
        _id:1,
        formjson:1,
        title:1,
        description:1,
    }
}


//completed jobs
const filterQuestionaires = function (and:any) {
    return [
        {
            $match: { 
                projectid : ObjectId(and[0].projectid),
                ismandatory : false
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
                ismandatory : false
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
    console.log(and)
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