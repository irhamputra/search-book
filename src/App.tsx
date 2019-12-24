import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

const App: React.FC = () => {
    const [query, setQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

    const ref = useRef(null);
    const lastBookElement = useCallback(
        node => {
            if (loading) return;
            if (ref.current) {
                // @ts-ignore because of null
                ref.current.disconnect();
            }
            // @ts-ignore because of null
            ref.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber(prevState => prevState + 1);
                }
            });
            if (node) {
                // @ts-ignore because of null
                ref.current.observe(node);
            }
        },
        [loading, hasMore]
    );

    const handleSearch = (e: any) => {
        setQuery(e.target.value);
        setPageNumber(1);
    };

    return (
        <div className='App'>
            <input type='text' value={query} onChange={handleSearch} />
            <ul>
                {books.map((book: any, i) => {
                    if (book.isbn) {
                        if (books.length === i + 1) {
                            return (
                                <li ref={lastBookElement} key={i}>
                                    {book.title} -{' '}
                                    <strong>{book.isbn[0]}</strong>
                                </li>
                            );
                        } else {
                            return (
                                <li key={i}>
                                    {book.title} -{' '}
                                    <strong>{book.isbn[0]}</strong>
                                </li>
                            );
                        }
                    }
                })}
            </ul>

            <h1>{loading && 'Loading...'}</h1>
            <h3>{error && 'Error!!'}</h3>
        </div>
    );
};

export default App;
