import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
  //  posts = [
  //    { title:'first post', content:'first post\'s content'},
  //    { title:'second post', content:'second post\'s content'},
  //    { title:'third post', content:'third post\'s content'}
  //  ]
  // @Input()

  posts: Post[]=[]
  private postSub: Subscription
  isLoading:boolean = true;

  constructor(public PostsService:PostService) {}

  ngOnInit(){
    this.PostsService.getPosts();
    this.isLoading = true
    this.postSub = this.PostsService.getupdatedPostsListener()
      .subscribe((updatedPosts: Post[])=>{
        this.posts = updatedPosts;
        this.isLoading = false
      })
  }

  onDelete(postId:string){
    this.PostsService.deletePost(postId)
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
