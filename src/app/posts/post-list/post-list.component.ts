import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  //  posts = [
  //    { title:'first post', content:'first post\'s content'},
  //    { title:'second post', content:'second post\'s content'},
  //    { title:'third post', content:'third post\'s content'}
  //  ]
  // @Input()

  posts: Post[] = [];
  private postSub: Subscription;
  isLoading = true;
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageOptions = [1, 2, 5, 10];

  constructor(public PostsService: PostService) { }

  ngOnInit() {
    this.PostsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postSub = this.PostsService.getupdatedPostsListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.PostsService.deletePost(postId).subscribe(() => {
      this.PostsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChange(page: PageEvent) {
    this.isLoading = true;
    this.currentPage = page.pageIndex + 1;
    this.postsPerPage = page.pageSize;
    this.PostsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
