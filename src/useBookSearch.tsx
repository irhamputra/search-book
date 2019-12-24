import { useEffect, useState } from 'react';
import axios from 'axios';

const useBookSearch = (query: string, pageNumber: number) => {
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
    }, [query]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel: () => void;
        axios
            .get('http://openlibrary.org/search.json', {
                params: { q: query, page: pageNumber },
                cancelToken: new axios.CancelToken(c => (cancel = c))
            })
            .then(res => {
                setBooks((prevState): any => {
                    return [
                        ...new Set<object[]>([...prevState, ...res.data.docs])
                    ];
                });
                setHasMore(res.data.docs.length > 0);
                setLoading(false);
            })
            .catch(e => {
                if (axios.isCancel(e)) return;
                setError(true);
            });
        return () => cancel();
    }, [query, pageNumber]);

    return { loading, error, books, hasMore };
};

export default useBookSearch;
