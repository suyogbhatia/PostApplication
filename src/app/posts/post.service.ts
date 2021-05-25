import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";


@Injectable({providedIn:'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated= new Subject<Post[]>();
  private apiURL = 'http://localhost:3000/api/posts'  //server url

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // return [...this.posts] //good practice to use spread operator (which doesn't send a reference to the original variable)
    this.http.get<{message:string, posts:any}>(this.apiURL)
      .pipe(map((postData)=>{
        return postData.posts.map(post=>{
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          }
        })
      }))
      .subscribe((posts:Post[])=>{
        this.posts = posts
        this.postsUpdated.next([...this.posts])
      })

    // this.http.post(this.apiURL, {'a':'lmao'},{})
  }

  getupdatedPostsListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(post=>post.id===id)}
    return this.http.get<{ _id: string, title: string, content: string }>(this.apiURL + '/' + id)
  }

  deletePost(postId: string) {
    this.http.delete<{ message: string }>(this.apiURL + '/' + postId)
      .subscribe(res => {
        console.log(res.message);
        const updatedPosts = this.posts.filter(post=> post.id != postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts])
      })
  }

  updatePost(post: Post) {
    this.http.put<{ message: string }>(this.apiURL + '/' + post.id, post)
      .subscribe((res) => {
        console.log(res)
        this.router.navigate(['/'])
      })
  }

  addPost(postAdded) {
    const postData = new FormData();
    postData.append("title", postAdded.title);
    postData.append("content", postAdded.content);
    postData.append("image", postAdded.image, postAdded.title);
    this.http.post<{message:string, post:Post}>(this.apiURL, postData)
      .subscribe((res)=>{
        console.log(res.message)
        this.posts.push({
          ...postAdded,
          id: res.post.id,
        });
        this.postsUpdated.next([...this.posts])
        this.router.navigate(['/'])
      })
  }
}
