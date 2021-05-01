const images = require('../models/m-image');
const { isEmptyObject } = require('../handler/common');

exports.getProfile = (req, res, next) => {
    images.find({ userId: req.session.userId }).populate({path:'userId',model:'tblusers'})
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
            res.render('profile', ({
                pageTitle: "Profile",
                data: finalData
            }))
        })
        .catch(err => console.log(err));
}

exports.getAddImage = (req, res, next) => {
    res.render('add-image', ({
        pageTitle: "Add Image"
    }))
}

exports.postAddImage = (req, res, next) => {
    title = req.body.txtTitle;
    image = req.file;
    imageUrl = image.filename;
    //console.log(req.session.userId);
    const post = new images({
        userId: req.session.userId,
        title: title,
        imageUrl: imageUrl,
        likes: 0
    })
    post.save()
        .then(result => {
            res.redirect('/profile');
        }).catch(err => console.log(err));
}

exports.getLike = (req, res, next) => {
    imageId = req.params.txtImageId;
    images.findOne({ _id: imageId })
        .then(result => {
            let likedBy = result.likedBy.items;
            let temp = isEmptyObject(likedBy);
            if (temp) {
                likedBy.push({
                    userId: req.session.userId
                });
                result.likedBy.items = likedBy;
                result.likes = Number(result.likes) + 1;
                result.save()
                    .then(data => {
                        if (data) {
                            res.redirect('/profile');
                        }
                    }).catch(err => console.log(err));
            } else {
                temp1 = false;
                for (let l of likedBy) {
                    if (l.userId == req.session.userId) {
                        temp1 = true;
                    }
                }
                if (temp1) {
                    redirect('/profile');
                } else {
                    likedBy.push({
                        userId: req.session.userId
                    });
                    result.likedBy.items = likedBy;
                    result.likes = Number(result.likes) + 1;
                    result.save()
                        .then(data => {
                            res.redirect('/profile');
                        }).catch(err => console.log(err));
                }
            }
        })
}

exports.getUnLike = (req, res, next) => {
    imageId = req.params.txtImageId;
    images.findOne({ _id: imageId })
        .then(result => {
            let likedBy = result.likedBy.items;
            let temp = isEmptyObject(likedBy);
            let fl = [];
            if (!temp) {
                for (let l of likedBy) {
                    if (!l.userId == req.session.userId) {
                        fl.push(l);
                    }
                }
                result.likedBy.items = fl;
                result.likes = Number(result.likes) - 1;
                result.save()
                    .then(data => {
                        res.redirect('/profile');
                    }).catch(err => console.log(err));
            } else {
                res.redirect('/profile');
            }
        }).catch(err => console.log(err));
}

exports.getLikeHome = (req, res, next) => {
    imageId = req.params.txtImageId;
    images.findOne({ _id: imageId })
        .then(result => {
            let likedBy = result.likedBy.items;
            let temp = isEmptyObject(likedBy);
            if (temp) {
                likedBy.push({
                    userId: req.session.userId
                });
                result.likedBy.items = likedBy;
                result.likes = Number(result.likes) + 1;
                result.save()
                    .then(data => {
                        if (data) {
                            res.redirect('/home');
                        }
                    }).catch(err => console.log(err));
            } else {
                temp1 = false;
                for (let l of likedBy) {
                    if (l.userId == req.session.userId) {
                        temp1 = true;
                    }
                }
                if (temp1) {
                    redirect('/home');
                } else {
                    likedBy.push({
                        userId: req.session.userId
                    });
                    result.likedBy.items = likedBy;
                    result.likes = Number(result.likes) + 1;
                    result.save()
                        .then(data => {
                            res.redirect('/home');
                        }).catch(err => console.log(err));
                }
            }
        })
}

exports.getUnLikeHome = (req, res, next) => {
    imageId = req.params.txtImageId;
    images.findOne({ _id: imageId })
        .then(result => {
            let likedBy = result.likedBy.items;
            let temp = isEmptyObject(likedBy);
            let fl = [];
            if (!temp) {
                for (let l of likedBy) {
                    if (!l.userId == req.session.userId) {
                        fl.push(l);
                    }
                }
                result.likedBy.items = fl;
                result.likes = Number(result.likes) - 1;
                result.save()
                    .then(data => {
                        res.redirect('/home');
                    }).catch(err => console.log(err));
            } else {
                res.redirect('/home');
            }
        }).catch(err => console.log(err));
}
