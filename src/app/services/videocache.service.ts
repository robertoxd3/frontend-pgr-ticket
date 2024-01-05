import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideocacheService {

  constructor() { }
  private readonly CACHE_KEY = 'video_cache';

  addToCache(videoUrl: string): void {
    const cachedVideos = this.getFromCache();
    if (!cachedVideos.includes(videoUrl)) {
      cachedVideos.push(videoUrl);
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cachedVideos));
      console.log(videoUrl+' agregado a la caché local.');
    }else{
      console.log("no se pudo agregar a cache "+videoUrl);
    }
  }

  getFromCache(): string[] {
    const cachedVideos = localStorage.getItem(this.CACHE_KEY);
    return cachedVideos ? JSON.parse(cachedVideos) : [];
  }

}
