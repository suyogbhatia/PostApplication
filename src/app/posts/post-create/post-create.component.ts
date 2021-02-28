import { formatCurrency } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredContent = ''
  // @Output() postCreated = new EventEmitter<Post>()

  constructor(public PostsService: PostService) {}

  onSavePost(postForm:NgForm) {
    if(postForm.invalid){
      return;
    }
    const post: Post = {
      title: postForm.value.title,
      content: postForm.value.content
    }
    this.PostsService.addPost(postForm.value.title, postForm.value.content)
    // this.postCreated.emit(post);
    postForm.resetForm();
  }
}
