import firebase from './firebase';

const db = firebase.firestore();

export const getData = (collection = 'news', limit = 10000) => {
    return db
        .collection(collection)
        .limit(limit)
        .get()
        .then((querySnapshot) => {
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({
                    ...doc.data(),
                    id: doc.id,
                });
            });
            return data;
        });
};

export const deleteData = (collection = 'news', doc) => {
    return db.collection(collection).doc(doc).delete();
};

export const addData = (collection = 'news', data, doc = '') => {
    if (doc === '') return db.collection(collection).add(data);
    else return db.collection(collection).doc(doc).set(data);
};

export const updateData = (collection = 'news', data, doc = '') => {
    return db.collection(collection).doc(doc).update(data);
};