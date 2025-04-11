import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiCall from "@/lib/apiCall";
import API from "@/lib/api";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category?: string;
  author?: string;
  image: string;
  createdAt?: string;
}

interface BlogState {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: BlogState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 📥 Neues Blog erstellen (FormData)
export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await API.post("/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.blog;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Fehler beim Erstellen des Blogeintrags.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// 📋 Alle Blogs laden (optional mit Kategorie)
export const fetchBlogs = createAsyncThunk<
  Blog[],                
  string | undefined  
>(
  "blogs/fetchBlogs",
  async (category, thunkAPI) => {
    const url = category ? `/blogs?category=${category}` : "/blogs";
    return await apiCall("get", url, null, thunkAPI.rejectWithValue);
  }
);


// 🔍 Blog mit Slug abrufen
export const fetchBlogBySlug = createAsyncThunk(
  "blogs/fetchBlogBySlug",
  async (slug: string, thunkAPI) =>
    await apiCall("get", `/blogs/slug/${slug}`, null, thunkAPI.rejectWithValue)
);

// ✏️ Blog aktualisieren (FormData)
export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async (payload: { id: string; formData: FormData }, thunkAPI) => {
    try {
      const response = await API.put(`/blogs/${payload.id}`, payload.formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.blog;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Fehler beim Aktualisieren des Blogeintrags.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ❌ Blog löschen
export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id: string, thunkAPI) =>
    await apiCall("delete", `/blogs/${id}`, null, thunkAPI.rejectWithValue)
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // CREATE
    builder.addCase(createBlog.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = "Blogeintrag wurde erfolgreich erstellt.";
      state.blogs.unshift(action.payload);
    });
    builder.addCase(createBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // FETCH ALL
    builder.addCase(fetchBlogs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload;
    });
    builder.addCase(fetchBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // FETCH SINGLE BY SLUG
    builder.addCase(fetchBlogBySlug.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBlogBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedBlog = action.payload;
    });
    builder.addCase(fetchBlogBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateBlog.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateBlog.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = "Blogeintrag wurde aktualisiert.";
      state.blogs = state.blogs.map((b) =>
        b._id === action.payload._id ? action.payload : b
      );
      if (state.selectedBlog?._id === action.payload._id) {
        state.selectedBlog = action.payload;
      }
    });
    builder.addCase(updateBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteBlog.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteBlog.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.meta.arg;
      state.blogs = state.blogs.filter((b) => b._id !== deletedId);
      state.successMessage = "Blogeintrag wurde gelöscht.";
    });
    builder.addCase(deleteBlog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearBlogMessages } = blogSlice.actions;
export default blogSlice.reducer;
