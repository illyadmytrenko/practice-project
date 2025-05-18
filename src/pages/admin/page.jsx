import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AdminPage.css";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    id: "",
    title: "",
    year: "",
    genre: "",
    duration: "",
    country: "",
    director: "",
    producer: "",
    studio: "",
    cast: "",
    rating: "",
    poster: "",
    trailer: "",
    description: "",
    isNowShowing: false,
    ageRestriction: "",
  });
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [editMovieData, setEditMovieData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDates, setSelectedDates] = useState(null);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState({
    hall: "",
    movieId: "",
    time: "",
    price: "",
    dates: [],
  });
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState(null);

  const tableClasses =
    "min-w-full table-auto bg-white rounded-xl overflow-hidden shadow";
  const theadClasses = "bg-green-800 text-white";
  const thClasses = "!px-3 !py-2 text-left font-semibold";
  const thClickableClasses = `${thClasses} cursor-pointer hover:bg-green-700 hover:text-white transition-colors`;
  const rowClasses =
    "odd:bg-gray-300 even:bg-gray-350 border-b border-gray-400";
  const tdClasses = "!px-3 !py-2";
  const rowFormClasses = "!mt-1 !p-2 !border !rounded";
  const MAX_DESC = 80;
  const years = Array.from({ length: 66 }, (_, i) => 1960 + i);
  const countryList = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Côte d'Ivoire",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo, Republic of the",
    "Congo, Democratic Republic of the",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMovie((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const body = {
      title: newMovie.title,
      year: Number(newMovie.year),
      genre: newMovie.genre.split(",").map((s) => s.trim()),
      duration: hours * 60 + minutes,
      country: newMovie.country,
      director: newMovie.director,
      producer: newMovie.producer,
      studio: newMovie.studio,
      cast: newMovie.cast.split(",").map((s) => s.trim()),
      rating: parseFloat(newMovie.rating),
      poster: newMovie.poster,
      trailer: newMovie.trailer,
      description: newMovie.description,
      isNowShowing: newMovie.isNowShowing,
      ageRestriction: newMovie.ageRestriction,
    };

    try {
      const { data: createdMovie } = await axios.post(
        //"http://localhost:5050/api/movies",
        "https://practice-project-f8zc.onrender.com/api/movies",
        body
      );

      setMovies((prev) => [...prev, createdMovie]);
      setShowAddModal(false);

      setNewMovie({
        title: "",
        year: "",
        genre: "",
        duration: "",
        country: "",
        director: "",
        producer: "",
        studio: "",
        cast: "",
        rating: "",
        poster: "",
        trailer: "",
        description: "",
        isNowShowing: false,
        ageRestriction: "",
      });
      setHours(0);
      setMinutes(0);
    } catch (err) {
      console.error("Ошибка добавления фильма:", err);
    }
  };

  const handleSort = (column) => {
    if (column === "poster") {
      setSortColumn(null);
      return;
    }
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = useMemo(() => {
    if (activeTab !== "users" || !sortColumn) return users;
    return [...users].sort((a, b) => {
      const aVal = a[sortColumn] ?? "";
      const bVal = b[sortColumn] ?? "";
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [users, activeTab, sortColumn, sortDirection]);

  const sortedMovies = useMemo(() => {
    if (!sortColumn) return movies;
    return [...movies].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (Array.isArray(aVal)) aVal = aVal.join(", ");
      if (Array.isArray(bVal)) bVal = bVal.join(", ");
      if (typeof aVal === "boolean") aVal = aVal ? 1 : 0;
      if (typeof bVal === "boolean") bVal = bVal ? 1 : 0;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [movies, sortColumn, sortDirection]);

  const sortedSchedule = useMemo(() => {
    const flat = scheduleData.flatMap((hallObj) =>
      hallObj.schedule.map((item) => ({
        id: item.id,
        hall: hallObj.hall,
        movieId: item.movieId,
        time: item.time,
        price: item.price,
        dates: item.dates,
        title:
          movies.find((m) => String(m.id) === String(item.movieId))?.title ||
          "",
      }))
    );
    if (activeTab !== "schedule" || !sortColumn) return flat;
    return [...flat].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      if (sortColumn === "movieId") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [scheduleData, activeTab, sortColumn, sortDirection]);

  const sortedByMovie = useMemo(() => {
    if (activeTab !== "report" || !sortColumn) return stats?.byMovie || [];
    return [...stats.byMovie].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [stats, activeTab, sortColumn, sortDirection]);

  const editMovie = (id) => {
    const m = movies.find((x) => x.id === id);
    if (!m) return;
    setEditMovieData({
      ...m,
      genre: m.genre.join(", "),
      cast: m.cast.join(", "),
    });
    setHours(Math.floor(m.duration / 60));
    setMinutes(m.duration % 60);
    setShowEditModal(true);
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditMovieData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...editMovieData,
        year: Number(editMovieData.year),
        rating: parseFloat(editMovieData.rating),
        duration: hours * 60 + minutes,
        genre: editMovieData.genre.split(",").map((s) => s.trim()),
        cast: editMovieData.cast.split(",").map((s) => s.trim()),
      };
      const { data: updated } = await axios.put(
        //`http://localhost:5050/api/movies/${editMovieData.id}`,
        `https://practice-project-f8zc.onrender.com/api/movies/${editMovieData.id}`,
        body
      );
      setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setShowEditModal(false);
      setEditMovieData(null);
    } catch (err) {
      console.error("Err in process of red the movie:", err);
      alert("Can`t save the changes. Please, try again later.");
    }
  };

  const deleteMovie = (id) => {
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    try {
      //await axios.delete(`http://localhost:5050/api/movies/${deleteId}`);
      await axios.delete(
        `https://practice-project-f8zc.onrender.com/api/movies/${deleteId}`
      );
      setMovies((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Err in process of del the movie:", err);
      alert("Can`t del the movie. Please, try again later.");
    }
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewScheduleItem((prev) => ({
      ...prev,
      [name]: name === "dates" ? value.split(",").map((s) => s.trim()) : value,
    }));
  };

  const handleScheduleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: updated } = await axios.put(
        // `http://localhost:5050/api/schedule/${scheduleToEdit.id}`,
        `https://practice-project-f8zc.onrender.com/api/schedule/${scheduleToEdit.id}`,
        newScheduleItem
      );
      setScheduleData((prev) =>
        prev.map((hallObj) => ({
          ...hallObj,
          schedule: hallObj.schedule.map((item) =>
            item.id === updated.id ? updated : item
          ),
        }))
      );
      setShowEditScheduleModal(false);
      setScheduleToEdit(null);
      setNewScheduleItem({
        hall: "",
        movieId: "",
        time: "",
        price: "",
        dates: [],
      });
    } catch (err) {
      console.error("Ошибка редактирования сеанса:", err);
    }
  };
  const handleScheduleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: created } = await axios.post(
        // "http://localhost:5050/api/schedule",
        "https://practice-project-f8zc.onrender.com/api/schedule",
        newScheduleItem
      );
      setScheduleData((prev) =>
        prev.map((hallObj) =>
          String(hallObj.hall) === String(newScheduleItem.hall)
            ? { ...hallObj, schedule: [...hallObj.schedule, created] }
            : hallObj
        )
      );
      setShowAddScheduleModal(false);
      setNewScheduleItem({
        hall: "",
        movieId: "",
        time: "",
        price: "",
        dates: [],
      });
    } catch (err) {
      console.error("Ошибка добавления сеанса:", err);
    }
  };
  const editSchedule = (item) => {
    setScheduleToEdit(item);
    setNewScheduleItem({ ...item });
    setShowEditScheduleModal(true);
  };

  const deleteSchedule = (item) => {
    setScheduleToDelete(item);
  };

  const confirmDeleteSchedule = async () => {
    try {
      await axios.delete(
        // `http://localhost:5050/api/schedule/${scheduleToDelete.id}`
        `https://practice-project-f8zc.onrender.com/api/schedule/${scheduleToDelete.id}`
      );
      setScheduleData((prev) =>
        prev.map((hallObj) => ({
          ...hallObj,
          schedule: hallObj.schedule.filter(
            (item) => item.id !== scheduleToDelete.id
          ),
        }))
      );
      setScheduleToDelete(null);
    } catch (err) {
      console.error("Ошибка удаления сеанса:", err);
    }
  };

  useEffect(() => {
    // axios.get("http://localhost:5050/api/movies")
    //     .then(res => setMovies(res.data));
    // axios.get("http://localhost:5050/api/users")
    //     .then(res => setUsers(res.data));
    // axios.get("http://localhost:5050/api/schedule")
    //     .then(res => setScheduleData(res.data));
    //
    // setLoadingStats(true);
    // axios.get("http://localhost:5050/api/payment/stats")
    axios
      .get("https://practice-project-f8zc.onrender.com/api/movies")
      .then((res) => setMovies(res.data));
    axios
      .get("https://practice-project-f8zc.onrender.com/api/users")
      .then((res) => setUsers(res.data));
    axios
      .get("https://practice-project-f8zc.onrender.com/api/schedule")
      .then((res) => setScheduleData(res.data));

    setLoadingStats(true);
    axios
      .get("https://practice-project-f8zc.onrender.com/api/payment/stats")
      .then((res) => {
        setStats(res.data);
        setErrorStats(null);
      })
      .catch((err) => {
        console.error(err);
        setErrorStats("Failed to load stats");
      })
      .finally(() => setLoadingStats(false));
  }, []);

  const renderMoviesTable = () => (
    <div className="overflow-auto">
      <table className={tableClasses}>
        <thead className={theadClasses}>
          <tr>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("poster")}
            >
              Poster
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("title")}
            >
              Title
              {sortColumn === "title" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("year")}
            >
              Year
              {sortColumn === "year" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("duration")}
            >
              Duration
              {sortColumn === "duration" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("genre")}
            >
              Genre
              {sortColumn === "genre" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("country")}
            >
              Country
              {sortColumn === "country" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("director")}
            >
              Director
              {sortColumn === "director" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("producer")}
            >
              Producer
              {sortColumn === "producer" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("studio")}
            >
              Studio
              {sortColumn === "studio" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("cast")}
            >
              Cast
              {sortColumn === "cast" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("rating")}
            >
              Rating
              {sortColumn === "rating" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("isNowShowing")}
            >
              Now Showing
              {sortColumn === "isNowShowing" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("ageRestriction")}
            >
              Age
              {sortColumn === "ageRestriction" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th className={thClasses}>Trailer</th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("description")}
            >
              Description
              {sortColumn === "description" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th className={thClasses}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sortedMovies) &&
            sortedMovies.map((m) => (
              <tr key={m.id} className={rowClasses}>
                <td className={tdClasses}>
                  <img
                    src={m.poster}
                    alt={m.title}
                    className="h-20 w-auto rounded"
                  />
                </td>
                <td className={`${tdClasses} font-medium`}>{m.title}</td>
                <td className={tdClasses}>{m.year}</td>
                <td className={tdClasses}>{m.duration} min</td>
                <td className={tdClasses}>{m.genre.join(", ")}</td>
                <td className={tdClasses}>
                  {Array.isArray(m.country) ? m.country.join(", ") : m.country}
                </td>
                <td className={tdClasses}>{m.director}</td>
                <td className={tdClasses}>{m.producer}</td>
                <td className={tdClasses}>{m.studio}</td>
                <td className={tdClasses}>{m.cast.join(", ")}</td>
                <td className={tdClasses}>{m.rating}</td>
                <td className={tdClasses}>{m.isNowShowing ? "✔️" : "—"}</td>
                <td className={tdClasses}>{m.ageRestriction}</td>
                <td className={tdClasses}>
                  <a
                    href={m.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-green-800"
                  >
                    Watch
                  </a>
                </td>
                <td className={tdClasses}>
                  {m.description.length > MAX_DESC ? (
                    <>
                      {m.description.slice(0, MAX_DESC)}
                      <button
                        onClick={() => setSelectedDescription(m.description)}
                        className="ml-1 text-green-800 hover:underline"
                      >
                        …
                      </button>
                    </>
                  ) : (
                    m.description
                  )}
                </td>
                <td className={tdClasses}>
                  <div className="!flex !flex-col items-center space-x-4">
                    {/* Look */}
                    <Link
                      to={`/movie/${m.id}/${m.title}`}
                      className="hover:text-gray-800"
                    >
                      <EyeIcon className="h-6 w-6 text-gray-600 !mb-2 transform transition-transform duration-200 hover:scale-120" />
                    </Link>
                    {/* Red */}
                    <button
                      onClick={() => editMovie(m.id)}
                      className="hover:text-green-800"
                    >
                      <PencilIcon className="h-6 w-6 text-green-600 !mb-2 transform transition-transform duration-200 hover:scale-120" />
                    </button>
                    {/* Del */}
                    <button
                      onClick={() => deleteMovie(m.id)}
                      className="hover:text-red-800"
                    >
                      <TrashIcon className="h-6 w-6 text-red-400 !mb-2 transform transition-transform duration-200 hover:scale-120" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const renderScheduleTable = () => (
    <div className="overflow-auto">
      <table
        className={
          "!min-w-full !table-fixed !bg-white !rounded-xl !overflow-hidden !shadow"
        }
      >
        <thead className={theadClasses}>
          <tr>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("hall")}
            >
              Hall
              {activeTab === "schedule" && sortColumn === "hall" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("time")}
            >
              Time
              {activeTab === "schedule" && sortColumn === "time" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("movieId")}
            >
              Movie ID
              {activeTab === "schedule" && sortColumn === "movieId" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("title")}
            >
              Title
              {activeTab === "schedule" && sortColumn === "title" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={thClickableClasses}
              onClick={() => handleSort("price")}
            >
              Price
              {activeTab === "schedule" && sortColumn === "price" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th className={thClasses}>Dates</th>
            <th className={thClasses}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedSchedule.map((e, i) => (
            <tr key={i} className={rowClasses}>
              <td className={tdClasses}>{e.hall}</td>
              <td className={tdClasses}>{e.time}</td>
              <td className={tdClasses}>{e.movieId}</td>
              <td className={tdClasses}>{e.title}</td>
              <td className={tdClasses}>{e.price}</td>
              <td
                className={`${tdClasses} cursor-pointer hover:text-green-800`}
                onClick={() => setSelectedDates(e.dates)}
              >
                {`${e.dates[0]} — ${e.dates[e.dates.length - 1]}`}
              </td>
              <td className={tdClasses}>
                <div className="!flex !items-center !justify-left !space-x-4">
                  <button onClick={() => editSchedule(e)}>
                    <PencilIcon className="!h-6 !w-6 text-green-600 transform transition-transform duration-200 hover:scale-120" />
                  </button>
                  <button onClick={() => deleteSchedule(e)}>
                    <TrashIcon className="!h-6 !w-6 text-red-400 transform transition-transform duration-200 hover:scale-120" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsersTable = () => (
    <div className="overflow-auto">
      <table className={tableClasses}>
        <thead className={theadClasses}>
          <tr>
            <th
              className={`${thClasses} cursor-pointer hover:bg-green-700 hover:text-white transition-colors`}
              onClick={() => handleSort("name")}
            >
              Name
              {activeTab === "users" && sortColumn === "name" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={`${thClasses} cursor-pointer hover:bg-green-700 hover:text-white transition-colors`}
              onClick={() => handleSort("email")}
            >
              Email
              {activeTab === "users" && sortColumn === "email" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
            <th
              className={`${thClasses} cursor-pointer hover:bg-green-700 hover:text-white transition-colors`}
              onClick={() => handleSort("role")}
            >
              Role
              {activeTab === "users" && sortColumn === "role" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "▲" : "▼"}
                </span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(sortedUsers) &&
            sortedUsers.map((u) => (
              <tr key={u.id} className={rowClasses}>
                <td className={`${tdClasses} font-medium`}>{u.name}</td>
                <td className={tdClasses}>{u.email}</td>
                <td className={tdClasses}>{u.role}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const renderReport = () => {
    if (loadingStats) return <p>Loading...</p>;
    if (errorStats) return <p className="text-red-600">{errorStats}</p>;
    if (!stats) return null;

    return (
      <div className="!overflow-auto">
        <div className="text-white !p-4 !rounded-xl !mb-6 !flex !flex-col !md:flex-row !md:items-center !md:justify-between">
          <h3 className="!text-xl !font-semibold !mb-4 !md:mb-0">
            Overall Sales Statistics
          </h3>
          <div className="!flex !space-x-8 !text-center">
            <div>
              <p className="!text-sm !uppercase !opacity-75">Tickets Sold</p>
              <p className="!text-2xl !font-bold">{stats.totalTickets}</p>
            </div>
            <div>
              <p className="!text-sm !uppercase !opacity-75">Total Revenue</p>
              <p className="!text-2xl !font-bold">{stats.totalRevenue} ₴</p>
            </div>
          </div>
        </div>

        <table className={tableClasses}>
          <thead className={theadClasses}>
            <tr>
              <th
                className={thClickableClasses}
                onClick={() => handleSort("title")}
              >
                Movie
                {activeTab === "report" && sortColumn === "title" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                className={`${thClickableClasses} text-right`}
                onClick={() => handleSort("count")}
              >
                Tickets
                {activeTab === "report" && sortColumn === "count" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
              <th
                className={`${thClickableClasses} text-right`}
                onClick={() => handleSort("revenue")}
              >
                Revenue
                {activeTab === "report" && sortColumn === "revenue" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedByMovie.map((m) => (
              <tr key={m.movieId} className={rowClasses}>
                <td className={tdClasses}>{m.title}</td>
                <td className={`${tdClasses} text-right`}>{m.count}</td>
                <td className={`${tdClasses} text-right`}>{m.revenue} ₴</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "movies":
        return renderMoviesTable();
      case "users":
        return renderUsersTable();
      case "schedule":
        return renderScheduleTable();
      case "report":
        return renderReport();
      default:
        return (
          <div className="text-white text-xl font-medium">Coming soon...</div>
        );
    }
  };

  const tabs = [
    { id: "movies", label: "Movies" },
    { id: "schedule", label: "Schedule" },
    { id: "users", label: "Users" },
    { id: "report", label: "Report" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="flex !flex-col !lg:flex-row gap-6">
        <aside className="!w-full lg:w-1/4 bg-zinc-900 rounded-xl p-4 shadow-lg">
          <div className="!flex !items-center !justify-between">
            <nav className="!flex flex-row gap-10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`text-left !px-4 !py-2 rounded-lg text-lg font-semibold transition-colors ${
                    activeTab === tab.id
                      ? "bg-white text-black"
                      : "text-white hover:bg-zinc-700"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            {activeTab === "movies" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="hover:bg-zinc-700 text-green-700 !px-3 !py-4 rounded-lg font-medium"
              >
                + Add Movie
              </button>
            )}
            {activeTab === "schedule" && (
              <button
                onClick={() => {
                  setScheduleToEdit(null);
                  setNewScheduleItem({
                    hall: "",
                    movieId: "",
                    time: "",
                    price: "",
                    dates: [],
                  });
                  setShowAddScheduleModal(true);
                }}
                className="hover:bg-zinc-700 text-green-700 !px-3 !py-4 rounded-lg font-medium"
              >
                + New Item
              </button>
            )}
          </div>
        </aside>
        <main className="!flex-grow !mb-8">{renderContent()}</main>
      </div>
      {selectedDescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 !bg-opacity-20 !backdrop-blur-sm" />
          <div className="relative bg-white rounded-xl !p-8 max-w-xl w-full">
            <button
              onClick={() => setSelectedDescription(null)}
              className="absolute !top-1 !right-4 text-gray-600 hover:text-gray-900 text-4xl !p-1 leading-none"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold !mb-4">Description</h3>
            <p className="text-gray-800 whitespace-pre-line">
              {selectedDescription}
            </p>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-opacity-20 backdrop-blur-sm" />
          <form
            onSubmit={handleAddSubmit}
            className="relative bg-white rounded-xl !p-8 max-w-2xl w-full !space-y-2 overflow-auto max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="!absolute !top-4 !right-8 text-gray-600 hover:text-gray-900 text-5xl leading-none"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold">Add New Movie</h3>

            <div className="!grid !grid-cols-2 !gap-4">
              <label className="flex flex-col !col-span-2">
                Title
                <input
                  name="title"
                  required
                  value={newMovie.title}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col">
                Year
                <select
                  name="year"
                  value={newMovie.year}
                  onChange={handleAddChange}
                  className={`${rowFormClasses} w-full`}
                  required
                >
                  <option value="">Select year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col">
                Genre (comma-separated)
                <input
                  name="genre"
                  value={newMovie.genre}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col">
                Duration
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="!mt-1 !p-2 !border !rounded !w-20 text-center"
                    placeholder="hrs"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="!mt-1 !p-2 !border !rounded !w-20 text-center"
                    placeholder="min"
                  />
                </div>
              </label>
              <label className="flex flex-col">
                Country
                <input
                  name="country"
                  value={newMovie.country}
                  onChange={handleAddChange}
                  list="country-options"
                  className={`${rowFormClasses} w-full`}
                  placeholder="Start typing..."
                  required
                />
                <datalist id="country-options">
                  {countryList.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <label className="flex flex-col">
                Age Restriction
                <select
                  name="ageRestriction"
                  value={newMovie.ageRestriction}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                  required
                >
                  <option value="">Select</option>
                  <option>0+</option>
                  <option>6+</option>
                  <option>12+</option>
                  <option>16+</option>
                  <option>18+</option>
                </select>
              </label>
              <label className="flex flex-col">
                Director
                <input
                  name="director"
                  value={newMovie.director}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col">
                Producer
                <input
                  name="producer"
                  value={newMovie.producer}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col">
                Studio
                <input
                  name="studio"
                  value={newMovie.studio}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col">
                Cast (comma-separated)
                <input
                  name="cast"
                  value={newMovie.cast}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col">
                Rating
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={newMovie.rating}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                  required
                />
              </label>
              <label className="flex flex-col">
                Poster URL
                <input
                  name="poster"
                  type="url"
                  value={newMovie.poster}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col">
                Trailer URL
                <input
                  name="trailer"
                  type="url"
                  value={newMovie.trailer}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="flex flex-col col-span-2">
                Description
                <textarea
                  name="description"
                  rows={4}
                  value={newMovie.description}
                  onChange={handleAddChange}
                  className={rowFormClasses}
                />
              </label>
              <label className="!flex !items-center !space-x-2 !accent-green-600">
                <input
                  name="isNowShowing"
                  type="checkbox"
                  checked={newMovie.isNowShowing}
                  onChange={handleAddChange}
                />
                <span>Now Showing</span>
              </label>
            </div>
            <div className="!flex !justify-end !space-x-4 !pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="!px-4 !py-2 rounded !border hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="!px-4 !py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Movie
              </button>
            </div>
          </form>
        </div>
      )}
      {deleteId && (
        <div className="fixed !inset-0 z-50 !flex !items-center !justify-center">
          <div className="absolute !inset-0 !bg-opacity-20 backdrop-blur-sm" />
          <div className="bg-white rounded-xl !p-6 !z-10">
            <p className="!mb-4">
              Are you sure? This Action Can Not Be Undone.
            </p>
            <div className="!flex !space-x-4 !justify-center !items-center">
              <button
                onClick={() => setDeleteId(null)}
                className="!px-4 !py-2 !border rounded hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white !px-4 !py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && editMovieData && (
        <div className="fixed inset-0 z-50 !flex !items-center !justify-center">
          <div className="absolute !inset-0 !bg-opacity-20 backdrop-blur-sm" />
          <form
            onSubmit={handleEditSubmit}
            className="relative bg-white rounded-xl !p-8 max-w-2xl w-full !space-y-2 overflow-auto max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="!absolute !top-4 !right-8 text-gray-600 hover:text-gray-900 text-5xl leading-none"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold">Edit Movie</h3>

            <div className="grid grid-cols-2 !gap-4">
              <label className="!flex !flex-col !col-span-2">
                Title
                <input
                  name="title"
                  required
                  value={editMovieData.title}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Year
                <select
                  name="year"
                  required
                  value={editMovieData.year}
                  onChange={handleEditChange}
                  className={`${rowFormClasses} w-full`}
                >
                  <option value="">Select year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col">
                Genre (comma-separated)
                <input
                  name="genre"
                  value={editMovieData.genre}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Duration
                <div className="flex !gap-2">
                  <input
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="!mt-1 !p-2 !border rounded !w-20 !text-center"
                    placeholder="hrs"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(Number(e.target.value))}
                    className="!mt-1 !p-2 !border !rounded !w-20 text-center"
                    placeholder="min"
                  />
                </div>
              </label>

              <label className="flex flex-col">
                Country
                <input
                  name="country"
                  list="country-options"
                  required
                  value={editMovieData.country}
                  onChange={handleEditChange}
                  className={`${rowFormClasses} w-full`}
                  placeholder="Start typing..."
                />
                <datalist id="country-options">
                  {countryList.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>

              <label className="flex flex-col">
                Age Restriction
                <select
                  name="ageRestriction"
                  required
                  value={editMovieData.ageRestriction}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                >
                  <option value="">Select</option>
                  <option>0+</option>
                  <option>6+</option>
                  <option>12+</option>
                  <option>16+</option>
                  <option>18+</option>
                </select>
              </label>

              <label className="flex flex-col">
                Director
                <input
                  name="director"
                  value={editMovieData.director}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Producer
                <input
                  name="producer"
                  value={editMovieData.producer}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Studio
                <input
                  name="studio"
                  value={editMovieData.studio}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Cast (comma-separated)
                <input
                  name="cast"
                  value={editMovieData.cast}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Rating
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  required
                  value={editMovieData.rating}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Poster URL
                <input
                  name="poster"
                  type="url"
                  value={editMovieData.poster}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col">
                Trailer URL
                <input
                  name="trailer"
                  type="url"
                  value={editMovieData.trailer}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex flex-col !col-span-2">
                Description
                <textarea
                  name="description"
                  rows={4}
                  value={editMovieData.description}
                  onChange={handleEditChange}
                  className={rowFormClasses}
                />
              </label>

              <label className="flex items-center !space-x-2 accent-green-600">
                <input
                  name="isNowShowing"
                  type="checkbox"
                  checked={editMovieData.isNowShowing}
                  onChange={handleEditChange}
                />
                <span>Now Showing</span>
              </label>
            </div>

            <div className="flex justify-end !space-x-4 !pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="!px-4 !py-2 rounded !border hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="!px-4 !py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      {selectedDates && (
        <div className="fixed inset-0 z-50 !flex !items-center !justify-center">
          <div className="absolute !inset-0 !bg-opacity-20 backdrop-blur-sm" />

          <div className="relative bg-white rounded-xl !p-6 !max-w-md !w-full">
            <button
              onClick={() => setSelectedDates(null)}
              className="!absolute !top-4 !right-6 text-gray-600 hover:text-gray-900 text-5xl leading-none"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold !mb-4 text-left">
              Seance Dates
            </h3>
            <Calendar
              className="!border-0"
              view="month"
              showNeighboringMonth={false}
              minDate={new Date(selectedDates[0])}
              maxDate={new Date(selectedDates[selectedDates.length - 1])}
              tileDisabled={({ date }) =>
                !selectedDates.includes(date.toISOString().slice(0, 10))
              }
              tileContent={({ date }) =>
                selectedDates.includes(date.toISOString().slice(0, 10)) ? (
                  <div className="!bg-green-300 !rounded-full !h-full !w-full !opacity-50" />
                ) : null
              }
            />
          </div>
        </div>
      )}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 !flex !items-center !justify-center">
          <div className="absolute !inset-0 !bg-opacity-20 backdrop-blur-sm" />
          <form
            onSubmit={handleScheduleAddSubmit}
            className="relative bg-white rounded-xl !p-6 !max-w-md !w-full !space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowAddScheduleModal(false)}
              className="!absolute !top-4 !right-6 text-gray-600 hover:text-gray-900 text-5xl leading-none"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold">Add Schedule Item</h3>
            <label className="flex flex-col">
              Hall
              <input
                name="hall"
                value={newScheduleItem.hall}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>
            <label className="flex flex-col">
              Movie ID
              <input
                name="movieId"
                value={newScheduleItem.movieId}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>
            <label className="flex flex-col">
              Time
              <input
                name="time"
                type="time"
                value={newScheduleItem.time}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>
            <label className="flex flex-col">
              Price
              <input
                name="price"
                type="number"
                value={newScheduleItem.price}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>
            <label className="flex flex-col">
              Dates (comma-separated)
              <input
                name="dates"
                value={newScheduleItem.dates.join(",")}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>
            <div className="!flex !justify-end !space-x-4">
              <button
                type="button"
                onClick={() => setShowAddScheduleModal(false)}
                className="!px-4 !py-2 rounded !border hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="!px-4 !py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
      {showEditScheduleModal && (
        <div className="fixed inset-0 z-50 !flex !items-center !justify-center">
          <div className="absolute !inset-0 !bg-opacity-20 backdrop-blur-sm" />
          <form
            onSubmit={handleScheduleEditSubmit}
            className="relative bg-white !rounded-xl !p-6 !max-w-md !w-full !space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowEditScheduleModal(false)}
              className="absolute !top-4 !right-6 text-gray-600 !text-5xl leading-none"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold">Edit Schedule Item</h3>

            <label className="!flex !flex-col">
              Hall
              <input
                name="hall"
                value={newScheduleItem.hall}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>

            <label className="flex flex-col">
              Movie ID
              <input
                name="movieId"
                value={newScheduleItem.movieId}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>

            <label className="flex flex-col">
              Time
              <input
                name="time"
                type="time"
                value={newScheduleItem.time}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>

            <label className="flex flex-col">
              Price
              <input
                name="price"
                type="number"
                value={newScheduleItem.price}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>

            <label className="flex flex-col">
              Dates (comma-separated)
              <input
                name="dates"
                value={newScheduleItem.dates.join(",")}
                onChange={handleScheduleChange}
                className={rowFormClasses}
              />
            </label>

            <div className="flex justify-end !space-x-4">
              <button
                type="button"
                onClick={() => setShowEditScheduleModal(false)}
                className="!px-4 !py-2 rounded !border hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="!px-4 !py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      {scheduleToDelete && (
        <div className="fixed inset-0 z-50 !flex !items-center !justify-center">
          <div className="absolute !inset-0 !bg-opacity-20 backdrop-blur-sm" />
          <div className="bg-white rounded-xl !p-6 !z-10">
            <p className="!mb-4">
              Are you sure you want to delete this schedule item?
            </p>
            <div className="!flex !justify-center !space-x-4">
              <button
                onClick={() => setScheduleToDelete(null)}
                className="!px-4 !py-2 !border rounded hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSchedule}
                className="bg-red-600 text-white !px-4 !py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
