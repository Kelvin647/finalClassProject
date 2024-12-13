$(document).ready(function() {
    let likedPosts = {}; // Track liked posts to prevent multiple likes
    let likedComments = {}; // Track liked comments to prevent multiple likes
    let dislikedPosts = {}; // Track disliked posts to prevent multiple dislikes
    let dislikedComments = {}; // Track disliked comments to prevent multiple dislikes
    let postCounter = 0; // To keep track of post ID

    // Function to submit a post (text + image/video)
    $("#submitPost").click(function() {
        const postContent = $("#postContent").val();
        const mediaFile = $("#mediaFile")[0].files[0];

        if (!postContent && !mediaFile) {
            alert("Please enter some text or upload a media file.");
            return;
        }

        const postId = postCounter++; // Use postCounter as unique post ID

        const post = {
            id: postId,
            content: postContent,
            media: mediaFile ? URL.createObjectURL(mediaFile) : null,
            mediaType: mediaFile ? mediaFile.type : null,
            likes: 0,
            dislikes: 0,
            likedByUser: false,
            dislikedByUser: false,
            comments: []
        };

        // Display the new post in the feed
        displayPost(post);

        // Clear the form
        $("#postContent").val('');
        $("#mediaFile").val('');
    });

    // Function to display a post in the feed
    function displayPost(post) {
        let mediaElement = '';
        if (post.media) {
            if (post.mediaType.includes('image')) {
                mediaElement = `<img src="${post.media}" alt="Post Media">`;
            } else if (post.mediaType.includes('video')) {
                mediaElement = `<video controls><source src="${post.media}" type="${post.mediaType}">Your browser does not support the video tag.</video>`;
            }
        }

        const postElement = `
            <div class="post" id="post-${post.id}">
                <p>${post.content}</p>
                ${mediaElement}
                <div>
                    <button class="likeBtn" data-id="${post.id}">${post.likedByUser ? "❤️ Liked" : "Like"}</button>
                    <button class="dislikeBtn" data-id="${post.id}">${post.dislikedByUser ? "😞 Disliked" : "Dislike"}</button>
                    <button class="commentBtn" data-id="${post.id}">Comment</button>
                </div>
                <div class="comment-section" id="comment-section-${post.id}"></div>
            </div>
        `;
        $("#posts").prepend(postElement);

        // Event listener for like button on post
        $(`#post-${post.id} .likeBtn`).click(function() {
            if (!post.likedByUser && !post.dislikedByUser) {
                post.likedByUser = true;
                post.likes++;
                $(this).text("❤️ Liked").addClass("liked");
            } else if (post.likedByUser) {
                post.likedByUser = false;
                post.likes--;
                $(this).text("Like").removeClass("liked");
            }

            if (post.dislikedByUser) {
                post.dislikedByUser = false;
                post.dislikes--;
                $(`#post-${post.id} .dislikeBtn`).text("Dislike").removeClass("disliked");
            }

            $(this).text(`❤️ Liked (${post.likes})`);
        });

        // Event listener for dislike button on post
        $(`#post-${post.id} .dislikeBtn`).click(function() {
            if (!post.dislikedByUser && !post.likedByUser) {
                post.dislikedByUser = true;
                post.dislikes++;
                $(this).text("😞 Disliked").addClass("disliked");
            } else if (post.dislikedByUser) {
                post.dislikedByUser = false;
                post.dislikes--;
                $(this).text("Dislike").removeClass("disliked");
            }

            if (post.likedByUser) {
                post.likedByUser = false;
                post.likes--;
                $(`#post-${post.id} .likeBtn`).text("Like").removeClass("liked");
            }

            $(this).text(`😞 Disliked (${post.dislikes})`);
        });

        // Event listener for comment button
        $(`#post-${post.id} .commentBtn`).click(function() {
            const commentText = prompt("Enter your comment:");
            if (commentText) {
                addComment(post, commentText);
            }
        });
    }

    // Function to add a comment
    function addComment(post, commentText) {
        const commentId = new Date().getTime(); // Unique ID for each comment

        const comment = {
            id: commentId,
            text: commentText,
            likes: 0,
            dislikes: 0,
            likedByUser: false,
            dislikedByUser: false,
            replies: []
        };

        post.comments.push(comment);

        // Display the comment
        const commentElement = `
            <div class="comment" id="comment-${comment.id}">
                <p>${comment.text}</p>
                <button class="likeBtn" data-id="${comment.id}">${comment.likedByUser ? "❤️ Liked" : "Like"}</button>
                <button class="dislikeBtn" data-id="${comment.id}">${comment.dislikedByUser ? "😞 Disliked" : "Dislike"}</button>
                <button class="reply" data-id="${comment.id}">Reply</button>
                <button class="edit" data-id="${comment.id}">Edit</button>
                <button class="delete" data-id="${comment.id}">Delete</button>
                <div class="comment-reply" id="reply-section-${comment.id}"></div>
            </div>
        `;
        $(`#comment-section-${post.id}`).prepend(commentElement);

        // Event listener for like button on comment
        $(`#comment-${comment.id} .likeBtn`).click(function() {
            if (!comment.likedByUser && !comment.dislikedByUser) {
                comment.likedByUser = true;
                comment.likes++;
                $(this).text("❤️ Liked").addClass("liked");
            } else if (comment.likedByUser) {
                comment.likedByUser = false;
                comment.likes--;
                $(this).text("Like").removeClass("liked");
            }

            if (comment.dislikedByUser) {
                comment.dislikedByUser = false;
                comment.dislikes--;
                $(`#comment-${comment.id} .dislikeBtn`).text("Dislike").removeClass("disliked");
            }

            $(this).text(`❤️ Liked (${comment.likes})`);
        });

        // Event listener for dislike button on comment
        $(`#comment-${comment.id} .dislikeBtn`).click(function() {
            if (!comment.dislikedByUser && !comment.likedByUser) {
                comment.dislikedByUser = true;
                comment.dislikes++;
                $(this).text("😞 Disliked").addClass("disliked");
            } else if (comment.dislikedByUser) {
                comment.dislikedByUser = false;
                comment.dislikes--;
                $(this).text("Dislike").removeClass("disliked");
            }

            if (comment.likedByUser) {
                comment.likedByUser = false;
                comment.likes--;
                $(`#comment-${comment.id} .likeBtn`).text("Like").removeClass("liked");
            }

            $(this).text(`😞 Disliked (${comment.dislikes})`);
        });

        // Event listener for reply button on comment
        $(`#comment-${comment.id} .reply`).click(function() {
            const replyText = prompt("Enter your reply:");
            if (replyText) {
                addReply(comment, replyText);
            }
        });

        // Event listener for edit button on comment
        $(`#comment-${comment.id} .edit`).click(function() {
            const newText = prompt("Edit your comment:", comment.text);
            if (newText) {
                comment.text = newText;
                $(`#comment-${comment.id} p`).text(newText);
            }
        });

        // Event listener for delete button on comment
        $(`#comment-${comment.id} .delete`).click(function() {
            if (confirm("Are you sure you want to delete this comment?")) {
                post.comments = post.comments.filter(c => c.id !== comment.id);
                $(`#comment-${comment.id}`).remove();
            }
        });
    }

    // Function to add a reply to a comment
    function addReply(comment, replyText) {
        const replyId = new Date().getTime(); // Unique ID for each reply

        const reply = {
            id: replyId,
            text: replyText,
            likes: 0,
            dislikes: 0,
            likedByUser: false,
            dislikedByUser: false
        };

        comment.replies.push(reply);

        // Display the reply
        const replyElement = `
            <div class="comment" id="reply-${reply.id}">
                <p>${reply.text}</p>
                <button class="likeBtn" data-id="${reply.id}">${reply.likedByUser ? "❤️ Liked" : "Like"}</button>
                <button class="dislikeBtn" data-id="${reply.id}">${reply.dislikedByUser ? "😞 Disliked" : "Dislike"}</button>
                <button class="edit" data-id="${reply.id}">Edit</button>
                <button class="delete" data-id="${reply.id}">Delete</button>
            </div>
        `;
        $(`#reply-section-${comment.id}`).prepend(replyElement);

        // Event listener for like button on reply
        $(`#reply-${reply.id} .likeBtn`).click(function() {
            if (!reply.likedByUser && !reply.dislikedByUser) {
                reply.likedByUser = true;
                reply.likes++;
                $(this).text("❤️ Liked").addClass("liked");
            } else if (reply.likedByUser) {
                reply.likedByUser = false;
                reply.likes--;
                $(this).text("Like").removeClass("liked");
            }

            if (reply.dislikedByUser) {
                reply.dislikedByUser = false;
                reply.dislikes--;
                $(`#reply-${reply.id} .dislikeBtn`).text("Dislike").removeClass("disliked");
            }

            $(this).text(`❤️ Liked (${reply.likes})`);
        });

        // Event listener for dislike button on reply
        $(`#reply-${reply.id} .dislikeBtn`).click(function() {
            if (!reply.dislikedByUser && !reply.likedByUser) {
                reply.dislikedByUser = true;
                reply.dislikes++;
                $(this).text("😞 Disliked").addClass("disliked");
            } else if (reply.dislikedByUser) {
                reply.dislikedByUser = false;
                reply.dislikes--;
                $(this).text("Dislike").removeClass("disliked");
            }

            if (reply.likedByUser) {
                reply.likedByUser = false;
                reply.likes--;
                $(`#reply-${reply.id} .likeBtn`).text("Like").removeClass("liked");
            }

            $(this).text(`😞 Disliked (${reply.dislikes})`);
        });

        // Event listener for edit button on reply
        $(`#reply-${reply.id} .edit`).click(function() {
            const newText = prompt("Edit your reply:", reply.text);
            if (newText) {
                reply.text = newText;
                $(`#reply-${reply.id} p`).text(newText);
            }
        });

        // Event listener for delete button on reply
        $(`#reply-${reply.id} .delete`).click(function() {
            if (confirm("Are you sure you want to delete this reply?")) {
                comment.replies = comment.replies.filter(r => r.id !== reply.id);
                $(`#reply-${reply.id}`).remove();
            }
        });
    }
});
