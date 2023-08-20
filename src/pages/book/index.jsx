import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";
import { handleGetDetailBookById } from "../../services/api";
import { useEffect, useState } from "react";

const BookPage = () => {
    const [dataBook, setDataBook] = useState([]);
    const location = useLocation();
    // console.log("cehck location", location)

    let params = new URLSearchParams(location.search);
    const id = params?.get("id");
    // console.log('check id', id)

    useEffect(() => {
        getBookDetail(id);
    }, [id]);

    const getBookDetail = async (id) => {
        const res = await handleGetDetailBookById(id);
        if (res && res.data) {
            let raw = res.data;
            raw.images = getImages(raw);
            setTimeout(() => {
                setDataBook(raw);
            }, 1000);
        }
    }

    const getImages = (data) => {
        const images = [];
        if (data?.thumbnail) {
            images.push(
                {
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${data.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${data.thumbnail}`,
                    originalClass: 'original-image',
                    thumbnailClass: 'thumbnail-image',
                }
            )
        }
        if (data?.slider && data.slider.length > 0) {
            data.slider.map((item) => {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                        originalClass: 'original-image',
                        thumbnailClass: 'thumbnail-image',
                    }
                )
            })
        }
        return images;
    }

    return (
        <>
            <div className="wrapper" style={{ backgroundColor: '#fff', padding: '1rem', margin: '0 10px' }}>

                <ViewDetail
                    dataBook={dataBook}
                />
            </div>

        </>
    )
}

export default BookPage;