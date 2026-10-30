
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "orvix_knowledge_records";

const navItems = [
  { name: "Dashboard", icon: "⌂" },
  { name: "Knowledge Vault", icon: "▤" },
  { name: "AI Search", icon: "⌕" },
  { name: "Insights", icon: "◈" },
];

const emptyForm = {
  title: "",
  category: "Development",
  description: "",
};

function loadRecords() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [records, setRecords] = useState(loadRecords);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const categories = useMemo(
    () => [...new Set(records.map((record) => record.category))],
    [records]
  );

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !query ||
        record.title.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query) ||
        record.category.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All" || record.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [records, search, categoryFilter]);

  const openNewRecord = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditRecord = (record) => {
    setForm({
      title: record.title,
      category: record.category,
      description: record.description,
    });
    setEditingId(record.id);
    setShowForm(true);
  };

  const saveRecord = (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description) return;

    if (editingId !== null) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === editingId
            ? {
                ...record,
                title,
                category: form.category,
                description,
                updatedAt: new Date().toISOString(),
              }
            : record
        )
      );
    } else {
      const newRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title,
        category: form.category,
        description,
        createdAt: new Date().toISOString(),
      };

      setRecords((previous) => [newRecord, ...previous]);
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    setSearch("");
    setCategoryFilter("All");
    setActiveTab("Knowledge Vault");
  };

  const deleteRecord = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (shouldDelete) {
      setRecords((previous) =>
        previous.filter((record) => record.id !== id)
      );
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setActiveTab("AI Search");
  };

  const formatDate = (date) => {
    if (!date) return "Recently added";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderRecords = (items) => {
    if (items.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <h3>No knowledge found</h3>
          <p>
            {search
              ? "Try another search term."
              : "Your knowledge records will appear here."}
          </p>
          {!search && (
            <button className="primary-btn" onClick={openNewRecord}>
              + Create your first record
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="records-grid">
        {items.map((record) => (
          <article className="record-card" key={record.id}>
            <div className="record-card-top">
              <span className="category-tag">{record.category}</span>
              <span className="record-date">
                {formatDate(record.createdAt)}
              </span>
            </div>

            <h3>{record.title}</h3>
            <p className="record-description">{record.description}</p>

            <div className="record-actions">
              <button
                className="secondary-btn"
                onClick={() => openEditRecord(record)}
              >
                Edit
              </button>
              <button
                className="danger-btn"
                onClick={() => deleteRecord(record.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">O</div>
          <div>
            <h2>ORVIX</h2>
            <span>KNOWLEDGE INTELLIGENCE</span>
          </div>
        </div>

        <div className="sidebar-section-label">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`menu-item ${
                activeTab === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab(item.name);
                if (item.name !== "AI Search") setSearch("");
                setCategoryFilter("All");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
              {item.name === "Knowledge Vault" && (
                <span className="nav-count">{records.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">✦</span>
            <h4>Your knowledge, organized.</h4>
            <p>Capture what you learn. Find it when you need it.</p>
          </div>
          <div className="sidebar-version">ORVIX · MVP v1.0</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activeTab}</strong>
          </div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>Local workspace</span>
          </div>
        </header>

        <div className="content">
          {activeTab === "Dashboard" && (
            <>
              <section className="welcome">
                <div>
                  <div className="eyebrow">YOUR KNOWLEDGE WORKSPACE</div>
                  <h1>Turn knowledge into <span>intelligence.</span></h1>
                  <p>
                    Capture ideas, organize what you learn, and keep important
                    information within reach.
                  </p>
                </div>
                <button className="primary-btn" onClick={openNewRecord}>
                  + New Record
                </button>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Records</div>
                  <div className="stat-value">{records.length}</div>
                  <div className="stat-note">Saved knowledge items</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Categories</div>
                  <div className="stat-value">{categories.length}</div>
                  <div className="stat-note">Areas of knowledge</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Recently Added</div>
                  <div className="stat-value">
                    {
                      records.filter((record) => {
                        const age = Date.now() - new Date(record.createdAt).getTime();
                        return age <= 7 * 24 * 60 * 60 * 1000;
                      }).length
                    }
                  </div>
                  <div className="stat-note">Records from the last 7 days</div>
                </div>
              </section>

              <section className="bottom-grid">
                <div className="panel">
                  <div className="section-heading">
                    <div>
                      <h2>Recent Knowledge</h2>
                      <p>Your latest saved records</p>
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => setActiveTab("Knowledge Vault")}
                    >
                      View all →
                    </button>
                  </div>

                  {records.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">✧</div>
                      <h3>Your vault starts here</h3>
                      <p>
                        Save your first idea, learning, project note, or
                        important decision.
                      </p>
                      <button
                        className="primary-btn"
                        onClick={openNewRecord}
                      >
                        + Create New Record
                      </button>
                    </div>
                  ) : (
                    renderRecords(records.slice(0, 3))
                  )}
                </div>

                <div className="panel intelligence-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Knowledge Intelligence</h2>
                      <p>Your workspace at a glance</p>
                    </div>
                    <span className="sparkle">✦</span>
                  </div>

                  <div className="insight-content">
                    <h3>Build your knowledge base.</h3>
                    <p>
                      Every useful idea you save makes your personal knowledge
                      library more valuable.
                    </p>
                    <div className="insight-metric">
                      <span>Knowledge records</span>
                      <strong>{records.length}</strong>
                    </div>
                    <div className="insight-metric">
                      <span>Organized categories</span>
                      <strong>{categories.length}</strong>
                    </div>
                    <button
                      className="secondary-btn full-width"
                      onClick={() => setActiveTab("Insights")}
                    >
                      Explore Insights →
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "Knowledge Vault" && (
            <section className="page-section">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">YOUR PERSONAL LIBRARY</div>
                  <h1>Knowledge Vault</h1>
                  <p>Store, manage, and rediscover what matters.</p>
                </div>
                <button className="primary-btn" onClick={openNewRecord}>
                  + New Record
                </button>
              </div>

              <div className="vault-toolbar">
                <input
                  className="vault-search"
                  type="search"
                  placeholder="Search titles, descriptions, categories..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select
                  className="category-select"
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                >
                  <option value="All">All categories</option>
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="results-label">
                {filteredRecords.length} record
                {filteredRecords.length !== 1 ? "s" : ""} found
              </div>

              {renderRecords(filteredRecords)}
            </section>
          )}

          {activeTab === "AI Search" && (
            <section className="page-section">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">FIND WHAT YOU KNOW</div>
                  <h1>Knowledge Search</h1>
                  <p>
                    Search across the records you have saved in your vault.
                  </p>
                </div>
              </div>

              <form className="ai-search-box" onSubmit={handleSearch}>
                <span className="search-symbol">⌕</span>
                <input
                  type="search"
                  placeholder="Search your saved knowledge..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <button className="primary-btn" type="submit">
                  Search
                </button>
              </form>

              <div className="search-disclaimer">
                This version searches saved records. AI-powered answers will be
                added in a later version.
              </div>

              <div className="section-heading search-results-heading">
                <div>
                  <h2>Search Results</h2>
                  <p>Matches from your Knowledge Vault</p>
                </div>
                <button
                  className="text-btn"
                  onClick={() => {
                    setSearch("");
                    setActiveTab("Knowledge Vault");
                  }}
                >
                  Open full vault →
                </button>
              </div>

              {renderRecords(filteredRecords)}
            </section>
          )}

          {activeTab === "Insights" && (
            <section className="page-section">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">UNDERSTAND YOUR LIBRARY</div>
                  <h1>Insights</h1>
                  <p>A simple overview of your saved knowledge.</p>
                </div>
              </div>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Records</div>
                  <div className="stat-value">{records.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Categories</div>
                  <div className="stat-value">{categories.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Records Without Duplicating</div>
                  <div className="stat-value">{records.length}</div>
                </div>
              </section>

              <div className="panel insights-list">
                <div className="section-heading">
                  <div>
                    <h2>Records by Category</h2>
                    <p>How your knowledge is organized</p>
                  </div>
                </div>

                {categories.length === 0 ? (
                  <div className="empty-state">
                    <h3>No insights yet</h3>
                    <p>Add records to see your category breakdown.</p>
                    <button
                      className="primary-btn"
                      onClick={openNewRecord}
                    >
                      + New Record
                    </button>
                  </div>
                ) : (
                  categories.map((category) => {
                    const count = records.filter(
                      (record) => record.category === category
                    ).length;

                    const percentage = records.length
                      ? Math.round((count / records.length) * 100)
                      : 0;

                    return (
                      <div className="category-insight" key={category}>
                        <div className="category-insight-top">
                          <span>{category}</span>
                          <strong>{count}</strong>
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="percentage-label">{percentage}%</span>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}

          <footer className="app-footer">
            ORVIX <span>·</span> Your knowledge, in one place.
          </footer>
        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <div
            className="record-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-modal-title"
          >
            <div className="modal-header">
              <div>
                <div className="eyebrow">
                  {editingId !== null ? "UPDATE YOUR LIBRARY" : "GROW YOUR LIBRARY"}
                </div>
                <h2 id="record-modal-title">
                  {editingId !== null ? "Edit Record" : "Create New Record"}
                </h2>
              </div>
              <button
                className="close-btn"
                type="button"
                aria-label="Close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveRecord}>
              <label htmlFor="record-title">Title</label>
              <input
                id="record-title"
                type="text"
                placeholder="e.g. What I learned about React"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                maxLength={120}
                required
              />

              <label htmlFor="record-category">Category</label>
              <select
                id="record-category"
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              >
                <option>Development</option>
                <option>Business</option>
                <option>Learning</option>
                <option>Ideas</option>
                <option>Projects</option>
                <option>Research</option>
                <option>Personal Notes</option>
              </select>

              <label htmlFor="record-description">Description / Notes</label>
              <textarea
                id="record-description"
                placeholder="Write down the idea, lesson, decision, or details you want to remember..."
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                rows={5}
                maxLength={5000}
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingId !== null ? "Save Changes" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
