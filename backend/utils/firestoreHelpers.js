/**
 * Converte um snapshot do Firestore em objeto JavaScript
 */
const docToObject = (doc) => {
    if (!doc.exists) return null;
    
    return {
      id: doc.id,
      ...doc.data()
    };
  };
  
  /**
   * Converte um snapshot de coleção em array de objetos
   */
  const collectionToArray = (snapshot) => {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };
  
  /**
   * Formata data para timestamp do Firestore
   */
  const getCurrentTimestamp = () => {
    return new Date().toISOString();
  };
  
  module.exports = {
    docToObject,
    collectionToArray,
    getCurrentTimestamp
  };