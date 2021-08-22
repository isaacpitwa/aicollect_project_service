const ObjectId = require('mongodb').ObjectID;

const questionaireschema = {
    _id:1,
    createdAt:1,
    isDeleted:1,
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
                projectid : and[0].projectid ? ObjectId(and[0].projectid):undefined,
                moduleid : and[0].moduleid ? ObjectId(and[0].moduleid) : undefined,
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
    filterQuestionaires:filterQuestionaires
}

export default aggregations;