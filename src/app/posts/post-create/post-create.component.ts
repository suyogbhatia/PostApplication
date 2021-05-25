import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit{
  // enteredContent = ''
  // @Output() postCreated = new EventEmitter<Post>()
  private mode:string = 'create';
  private postId:string;
  private post:Post;
  form:FormGroup;
  isLoading:boolean = false;
  imagePreview:string;

  constructor(public PostsService: PostService, private route:ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
        }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators:[Validators.required],
        asyncValidators: [mimeType]
      })
    })
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true;
        this.PostsService.getPost(this.postId)
          .subscribe(postData=>{
            this.post = {
              title:postData.title,
              content:postData.content,
              id:postData._id,
              imagePath: null
            }
            this.form.setValue({title:postData.title, content:postData.content})
            this.isLoading = false
          })
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]   //to tell ts that event.target is an input element so that files is a valid property
    this.form.patchValue({image: file})
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
      imagePath: null
    }
    if(this.mode === 'create'){
      this.PostsService.addPost({ ...post, image: this.form.value.image })
    } else {
      this.PostsService.updatePost({...post, id:this.postId})
    }

    // this.postCreated.emit(post);
    this.form.reset();
  }
}
