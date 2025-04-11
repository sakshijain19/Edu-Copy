/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Search, MapPin, IndianRupee, ArrowLeft, Send } from "lucide-react";
import axios from 'axios';
import AuthModal from '../AuthModal/AuthModal.jsx';
import { Input } from "../BookCompo/Input/Input";
import { Button } from "../BookCompo/Button/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../BookCompo/Select/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../BookCompo/Card/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../BookCompo/Tabs/Tabs";

const BooksPage = () => {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsAuthenticated(true);
        setAuthError('');
      } catch (error) {
        setIsAuthenticated(false);
        setAuthError('Please login to access all features');
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  // Load books from API
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('/api/books');
        setBooks(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);

  const [sellFormData, setSellFormData] = useState({
    bookImage: null,
    bookTitle: "",
    author: "",
    condition: "",
    language: "",
    upiId: "",
    mobileNumber: "",
    phone: "",
    price: "",
    location: "",
    edition: "",
    pages: "",
    description: "",
  });

  const handleSellFormChange = (e) => {
    const { name, value } = e.target;

    // Add validation for author field
    if (name === "author") {
      // Allow only letters and spaces
      if (!/^[A-Za-z\s]*$/.test(value)) {
        alert("Author name should contain only alphabets");
        return;
      }
    }
    setSellFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    setSellFormData((prevState) => ({
      ...prevState,
      bookImage: file,
    }));
  };

  const handleSellFormSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const requiredFields = [
      "bookImage",
      "bookTitle",
      "author",
      "condition",
      "language",
      "upiId",
      "mobileNumber",
      "price",
      "location",
      "pages",
    ];

    for (const field of requiredFields) {
      if (!sellFormData[field]) {
        alert(
          `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`,
        );
        return;
      }
    }

    // Validate UPI ID format
    if (!sellFormData.upiId.endsWith('@ybl')) {
      alert('UPI ID must end with @ybl');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+91[0-9]{10}$/;
    if (!phoneRegex.test(sellFormData.mobileNumber)) {
      alert('Please enter a valid Indian phone number (+91XXXXXXXXXX)');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', sellFormData.bookImage);
      formData.append('title', sellFormData.bookTitle);
      formData.append('author', sellFormData.author);
      formData.append('price', sellFormData.price);
      formData.append('location', sellFormData.location);
      formData.append('edition', sellFormData.edition);
      formData.append('language', sellFormData.language.toLowerCase());
      formData.append('upiId', sellFormData.upiId);
      formData.append('phone', sellFormData.mobileNumber);
      formData.append('description', sellFormData.description);
      formData.append('condition', sellFormData.condition);
      formData.append('pages', sellFormData.pages);

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/books/list', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setBooks([...books, response.data]);
      alert('Book listed for sale successfully!');

      // Reset form after successful submission
      setSellFormData({
        bookImage: null,
        bookTitle: "",
        author: "",
        condition: "",
        language: "",
        upiId: "",
        mobileNumber: "+91",
        price: "",
        location: "",
        edition: "",
        pages: "",
        description: "",
      });
    } catch (error) {
      console.error('Error listing book:', error);
      const errorMessage = error.response?.data?.message || 'Failed to list book. Please try again.';
      alert(errorMessage);
    }

    // Reset the form
    setSellFormData({
      bookImage: null,
      bookTitle: "",
      author: "",
      condition: "",
      language: "",
      upiId: "",
      mobileNumber: "+91",
      price: "",
      location: "",
      edition: "",
      pages: "",
      description: "",
    });
  };

  const filteredBooks = Array.isArray(books) ? books.filter((book) => {
    if (!book) return false;
    const matchesLocation = !location || book.location?.toLowerCase().includes(location.toLowerCase());
    const matchesSearchQuery = !searchQuery || book.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriceRange = !priceRange || (
      priceRange === "1000+" ? book.price >= 1000 :
      book.price >= parseInt(priceRange.split("-")[0]) && book.price <= parseInt(priceRange.split("-")[1])
    );
    return matchesLocation && matchesSearchQuery && matchesPriceRange;
  }) : [];

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleBackClick = () => {
    setSelectedBook(null);
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/books/${selectedBook.id}/messages`, {
        message,
        buyerPhone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Message sent to the seller successfully!');
      setMessage('');
      setBuyerPhone('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-black">
        Books Marketplace
      </h1>

      {!selectedBook && (
        <>
          {activeTab === "browse" && (
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
              <div className="w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-1/3">
                <Input
                  type="text"
                  placeholder="Search for books"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100-200">₹100 - ₹200</SelectItem>
                  <SelectItem value="200-300">₹200 - ₹300</SelectItem>
                  <SelectItem value="300-400">₹300 - ₹400</SelectItem>
                  <SelectItem value="400-500">₹400 - ₹500</SelectItem>
                  <SelectItem value="500-600">₹500 - ₹600</SelectItem>
                  <SelectItem value="600-700">₹600 - ₹700</SelectItem>
                  <SelectItem value="700-800">₹700 - ₹800</SelectItem>
                  <SelectItem value="800-900">₹800 - ₹900</SelectItem>
                  <SelectItem value="900-1000">₹900 - ₹1000</SelectItem>
                  <SelectItem value="1000+">₹1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex justify-center mb-6">
              <TabsTrigger
                value="browse"
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === "browse"
                    ? "bg-gray-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-800"
                } focus:outline-none hover:bg-gray-400`}
                onClick={() => setActiveTab("browse")}
              >
                Browse Books
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className={`px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === "sell"
                    ? "bg-gray-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-800"
                } focus:outline-none hover:bg-gray-400`}
                onClick={() => setActiveTab("sell")}
              >
                Sell a Book
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                      onClick={() => handleBookClick(book)}
                    >
                      <div className="relative">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <h3 className="text-white font-semibold text-lg">
                            {book.title}
                          </h3>
                          <p className="text-white/90 text-sm">{book.author}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{book.location}</span>
                          </div>
                          <div className="flex items-center text-gray-800 font-semibold">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            <span>₹{book.price}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-red-600 text-lg mt-14 mb-64">
                  No books found matching your search.
                </div>
              )}
            </TabsContent>

            <TabsContent value="sell">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-900">
                    Sell Your Book
                  </CardTitle>
                  <CardDescription>
                    Fill in the details of your book
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSellFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Book Image
                      </label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Book Title
                      </label>
                      <Input
                        name="bookTitle"
                        value={sellFormData.bookTitle}
                        onChange={handleSellFormChange}
                        placeholder="Enter book title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Author
                      </label>
                      <Input
                        name="author"
                        value={sellFormData.author}
                        onChange={handleSellFormChange}
                        placeholder="Enter author name"
                        pattern="[A-Za-z\s]+"
                        title="Please enter only alphabets"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Condition
                      </label>
                      <Select
                        value={sellFormData.condition}
                        onValueChange={(value) =>
                          handleSellFormChange({
                            target: { name: "condition", value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select book condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Average</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Language
                      </label>
                      <Input
                        name="language"
                        value={sellFormData.language}
                        onChange={handleSellFormChange}
                        placeholder="Enter book language"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        UPI ID
                      </label>
                      <Input
                        name="upiId"
                        value={sellFormData.upiId}
                        onChange={handleSellFormChange}
                        placeholder="Enter UPI ID (must end with @ybl)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Mobile Number
                      </label>
                      <Input
                        name="mobileNumber"
                        value={sellFormData.mobileNumber}
                        onChange={handleSellFormChange}
                        placeholder="+91"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Price
                      </label>
                      <Input
                        name="price"
                        type="number"
                        value={sellFormData.price}
                        onChange={handleSellFormChange}
                        placeholder="Enter price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Your Location
                      </label>
                      <Input
                        name="location"
                        value={sellFormData.location}
                        onChange={handleSellFormChange}
                        placeholder="Enter your location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Edition
                      </label>
                      <Input
                        name="edition"
                        value={sellFormData.edition}
                        onChange={handleSellFormChange}
                        placeholder="Enter book edition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Pages
                      </label>
                      <Input
                        name="pages"
                        type="number"
                        value={sellFormData.pages}
                        onChange={handleSellFormChange}
                        placeholder="Enter number of pages"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Book Description
                      </label>
                      <textarea
                        name="description"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                        placeholder="Book Description"
                        rows={4}
                        value={sellFormData.description}
                        onChange={handleSellFormChange}
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-black bg-blue hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                    >
                      List Book for Sale
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {selectedBook && (
        <div className="mt-8">
          <Button onClick={handleBackClick} className="mb-4 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Books
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>{selectedBook.title}</CardTitle>
              <CardDescription>{selectedBook.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={selectedBook.image}
                alt={selectedBook.title}
                className="w-full h-64 object-cover mb-4"
              />
              <p className="flex items-center text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" /> {selectedBook.location}
              </p>
              <p className="flex items-center text-gray-700 mb-2">
                <IndianRupee className="w-4 h-4 mr-2" /> ₹{selectedBook.price}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Edition:</strong> {selectedBook.edition}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Language:</strong> {selectedBook.language}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>upiId:</strong> {selectedBook.upiId}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Description:</strong> {selectedBook.description}
              </p>

              <div className="mt-6">
                <p className="text-gray-700 mb-4">
                  <strong><h3>Contact Seller</h3></strong> {selectedBook.phone}
                </p>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Enter your mobile number"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
                <textarea
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Enter your message to the seller..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${selectedBook?.phone ? selectedBook.phone.replace(/[^0-9]/g, "") : ""}?text=${encodeURIComponent(
                      `Hi, I'm interested in buying your book "${selectedBook?.title || ""}" listed on EduTrade.\n\nMessage: ${message}\n\nPrice: ₹${selectedBook?.price || ""}\n\nBuyer's Contact: ${buyerPhone}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => {
            setIsAuthenticated(true);
            setAuthError('');
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BooksPage;