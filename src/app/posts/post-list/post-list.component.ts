import { Component, Input } from "@angular/core";
import { Post } from "../post.model";

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']
})
export class PostListComponent {
//  posts = [
//    { title:'first post', content:'first post\'s content'},
//    { title:'second post', content:'second post\'s content'},
//    { title:'third post', content:'third post\'s content'}
//  ]
@Input() posts: Post[]=[]
}
