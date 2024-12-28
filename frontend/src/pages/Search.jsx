
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeadCard from "../component/LeadCard";

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        sort: "desc",
        category: "",
    });
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm') || '';
        const sortFromUrl = urlParams.get('sort') || 'desc';
        const categoryFromUrl = urlParams.get('category') || '';

        setSidebarData({
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
        });

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            try {
                const res = await fetch(`/api/lead/getleads?${searchQuery}`);
                if (res.ok) {
                    const data = await res.json();
                    setLeads(data.leads);
                    setLoading(false);
                    setShowMore(data.leads.length === 9);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                setLoading(false);
                console.error("Failed to fetch leads:", error);
            }
        };

        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSidebarData((prev) => ({
            ...prev,
            [id]: value || '',
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams({
            searchTerm: sidebarData.searchTerm,
            sort: sidebarData.sort,
            category: sidebarData.category,
        });
        navigate(`/search?${urlParams.toString()}`);
    };

    const handleShowMore = async () => {
        const numberOfPosts = leads.length;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', numberOfPosts);
        const searchQuery = urlParams.toString();

        try {
            const res = await fetch(`/api/lead/getleads?${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setLeads((prevPosts) => [
                    ...prevPosts,
                    ...data.leads,
                ]);
                setShowMore(data.leads.length === 9);
            }
        } catch (error) {
            console.error("Failed to fetch more posts:", error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term:</label>
                        <TextInput
                            placeholder="Search..."
                            type="text"
                            id="searchTerm"
                            value={sidebarData.searchTerm || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Sort:</label>
                        <Select onChange={handleChange} value={sidebarData.sort || ''} id="sort">
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="font-semibold">Category:</label>
                        <TextInput
                            placeholder="Category..."
                            type="text"
                            id="category"
                            value={sidebarData.category || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <Button type="submit" outline gradientDuoTone="purpleToPink">Apply Filters</Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Leads results:</h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && leads.length === 0 && (
                        <p className="text-xl text-gray-500">No Leads found!</p>
                    )}
                    {loading && (
                        <p className="text-xl text-gray-500">Loading...</p>
                    )}
                    {!loading && leads.length > 0 && leads.map((lead) => (
                        <LeadCard key={lead._id} lead={lead} />
                    ))}
                    {showMore && (
                        <button onClick={handleShowMore} className="text-teal-500 text-lg hover:underline p-7 w-full">
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
