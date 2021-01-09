import { data } from '../data/data';
import axios from 'axios';

const searchAll = async query => {
  await axios
    .get(`${data.baseURL}/call/find?search=${query}`)
    .then(response => data.inAll.push(...response.data));
};

export const clearAll = () => {
  data.inAll = [];
};

export const searchInAll = async query => {
  if (data.inAll.length === 0) {
    await searchAll(query);
  } else {
    clearAll();
    await searchAll(query);
  }
};
