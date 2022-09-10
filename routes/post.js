const router =require("express").Router();
const Post =require("../models/Post");
const User =require("../models/User")
//投稿を作成する
router.post("/",async(req,res)=>{
    const newPost =new Post(req.body);
    try{
        const savedPost =await newPost.save();
        return res.status(200).json(savedPost);
    }catch(err){
        return res.status(500).json(err);
    }

});
//投稿を更新する
router.put("/:id",async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.updateOne({
                $set:req.body,
            });
            return res.status(200).json("投稿の編集を完了しました");
        }else{
            return res.status(403).json("あなたは他の人の投稿を編集できません");

        }
        
    }catch(err){
        return res.status(403).json(err);
    }

});

//投稿を消去
router.delete("/:id",async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id);
        if(post.userId===req.body.userId){
            await post.deleteOne();
            return res.status(200).json("投稿を消去しました");
        }else{
            return res.status(403).json("他の人の投稿を削除できません");

        }
        
    }catch(err){
        return res.status(403).json(err);
    }

});
//投稿を取得する
router.get("/:id",async(req,res)=>{
    try{
        const post =await Post.findById(req.params.id);
        return res.status(200).json(post);
    }catch(err){
        return res.status(403).json(err);
    }

});

//投稿にいいねを押す
router.put("/:id/like",async(req,res)=>{
        try{
            const post =await Post.findById(req.params.id);
            //いいねしていない場合は、いいねを追加
            if(!post.likes.includes(req.body.userId)){
                await post.updateOne({
                    $push:{
                        likes: req.body.userId,
                    },
                });
                return res.status(200).json("投稿にいいね！しました");
            //既にいいね！を押されている
            }else{
            //いいねしているユーザーidを取り除く
                await post.updateOne({
                    $pull:{
                        likes:req.body.userId,
                    },
                })
                return res.status(403).json("いいねを外しました");
            }
        }catch (err){
            return res.status(500).json(err);
        }
})

//プロフィールのタイムライン取得
router.get("/profile/:username",async (req,res)=>{
    try {
        const user = await User.findOne({username:req.params.username});
        const post =await Post.find({userId:user._id});
            return res.status(200).json(post)
    }catch(err){
        return res.status(500).json(err);
    }
})




//タイムラインの投稿を取得
router.get("/timeline/:userId",async (req,res)=>{
    try {
        const currentUser= await User.findById(req.params.userId);
        const userPosts =await Post.find({userId:currentUser._id});
        //自分がフォローした投稿を表示
        const friendPost =await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId});
            })
        );

            return res.status(200).json(userPosts.concat(...friendPost))

    }catch(err){
        return res.status(500).json(err);
    }
})

module.exports =router