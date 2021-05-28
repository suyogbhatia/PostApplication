import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";


@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private apiURL = 'http://localhost:3000/api/posts'  //server url

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage, currentPage) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    // return [...this.posts] //good practice to use spread operator (which doesn't send a reference to the original variable)
    this.http.get<{ message: string, posts: any, maxCount: number }>(this.apiURL + queryParams)
      .pipe(map((postData) => {
        return {
            posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            }
          }),
          maxCount: postData.maxCount
        }
      }))
      .subscribe((transforedData) => {
        this.posts = transforedData.posts
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transforedData.maxCount })
      })

    // this.http.post(this.apiURL, {'a':'lmao'},{})
  }

  getupdatedPostsListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(post=>post.id===id)}
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(this.apiURL + '/' + id)
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(this.apiURL + '/' + postId)
      // .subscribe(res => {
      //   console.log(res.message);
      //   const updatedPosts = this.posts.filter(post => post.id != postId);
      //   this.posts = updatedPosts;
      //   this.postsUpdated.next([...this.posts])
      // })
  }

  addPost(postAdded) {
    const postData = new FormData();
    postData.append("title", postAdded.title);
    postData.append("content", postAdded.content);
    postData.append("image", postAdded.image, postAdded.title);
    this.http.post<{ message: string, post: Post }>(this.apiURL, postData)
      .subscribe((res) => {
        // console.log(res.post)
        // this.posts.push({
        //   ...postAdded,
        //   id: res.post.id,
        // });
        // this.postsUpdated.next([...this.posts])
        this.router.navigate(['/'])
      })
  }

  updatePost(post: Post, image: File | string) {
    let postData: Post | FormData;  // if imagePath is a string then data is JSON data, else if it's a file then the data is FOrmData
    if (typeof (image) === 'object') {
      postData = new FormData()
      postData.append('id', post.id)
      postData.append('title', post.title)
      postData.append('content', post.content)
      postData.append('image', image, post.title)
    } else {
      postData = { ...post, imagePath: image }
    }
    this.http.put<{ message: string }>(this.apiURL + '/' + post.id, postData)
      .subscribe((res) => {
      //   const updatedPosts = [...this.posts]
      //   const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
      //   updatedPosts[oldPostIndex] = post
      //   this.posts = updatedPosts;
      //   this.postsUpdated.next([...this.posts])
      //   console.log(res)
        this.router.navigate(['/'])
      })
  }

}
