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

  constructor(public PostsService:PostService) {}

  ngOnInit(){
    this.posts = this.PostsService.getPosts();
    this.postSub = this.PostsService.getupdatedPostsListener()
      .subscribe((posts: Post[])=>{
        this.posts = posts;
      })
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
