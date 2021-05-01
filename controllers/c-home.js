const images = require('../models/m-image');
const { isEmptyObject } = require('../handler/common');

exports.getHome = (req, res, next) => {
    images.find().populate({path:'userId',model:'tblusers'})
        .sort({ createdAt: 'desc' })
        .then(data => {
            finalData = [];
            for (let post of data) {
                const likes = post.likedBy.items;
                const likeResult = isEmptyObject(likes);
                if (!likeResult) {
                    let temp = false;
                    for(let l of likes){
                        if(l.userId.toString()==req.session.userId){
                            temp=true
                        }
                    }
                    let isLike = false;
                    if(temp == true){
                        isLike = true;
                    }
                    finalData.push({
                        id: post._id,
                        isLike: isLike,
                        title: post.title,
                        imageUrl: post.imageUrl,
                        name: post.userId.name,
                        likes: post.likes
                    });
                } else {
                    finalData.push({
                        id: post._id,
                        isLike: false,
                        title: post.title,
                        imageUrl: post.imageUrl,
                        name: post.userId.name,
                        likes: post.likes
                    })
                }
            }
            res.render('home', ({
                pageTitle: "Home",
                data: finalData
            }))
        })
        .catch(err => console.log(err));
}