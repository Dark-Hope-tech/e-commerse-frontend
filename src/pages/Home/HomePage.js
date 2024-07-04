import React, { useEffect, useReducer, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';

const Search = lazy(() => import('../../components/Search/Search'));
const Tags = lazy(() => import('../../components/Tags/Tags'));
const Thumbnails = lazy(() => import('../../components/Thumbnails/Thumbnails'));
const NotFound = lazy(() => import('../../components/NotFound/NotFound'));

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { foods, tags } = state;
  const { searchTerm, tag } = useParams();

  useEffect(() => {
    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Search />
      <Tags tags={tags} />
      {foods.length === 0 && <NotFound linkText="Reset Search" />}
      <Thumbnails foods={foods} />
    </Suspense>
  );
}
