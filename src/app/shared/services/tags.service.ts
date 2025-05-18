import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';
import { Tag } from '../models/Tag';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  constructor(private firestore: Firestore) {}

  async getAllTags() {
    const tags: Tag[] = [];
    const tagsCollection = collection(this.firestore, 'Tags');
    const q = query(tagsCollection);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      tags.push({ ...doc.data() } as Tag);
    });
    return tags;
  }
}
