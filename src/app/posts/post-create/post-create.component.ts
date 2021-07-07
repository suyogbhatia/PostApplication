import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  // enteredContent = ''
  // @Output() postCreated = new EventEmitter<Post>()
  private mode: string = 'create';
  private postId: string;
  private post: Post;
  form: FormGroup;
  isLoading: boolean = false;
  imagePreview: string;
  authStatusSub: Subscription

  constructor(public PostsService: PostService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((res)=>{
      debugger;
      this.isLoading = false;
    })
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true;
        this.PostsService.getPost(this.postId)
          .subscribe(postData => {
            this.post = {
              title: postData.title,
              content: postData.content,
              id: postData._id,
              imagePath: postData.imagePath,
              creator: postData.creator
            }
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            })
            this.isLoading = false
          })
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];   // to tell ts that event.target is an input element so that files is a valid property
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  onSavePost() {
    // if(this.form.invalid){
    //   return;
    // }
    this.isLoading = true;
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: null,
      creator: null
    };
    console.log(this.form.value.image);

    if (this.mode === 'create') {
      this.PostsService.addPost({ ...post, image: this.form.value.image }) // in case there is an error adding the post the loader in isloading should be hidden
    } else {
      this.PostsService.updatePost({ ...post, id: this.postId }, this.form.value.image)
    }

    // this.postCreated.emit(post);
    this.form.reset();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
