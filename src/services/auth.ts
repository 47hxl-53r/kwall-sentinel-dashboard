
import { apiFetch, ApiResponse } from "./api";
import { toast } from "sonner";

export interface User {
  username: string;
}

export async function login(username: string, password: string): Promise<User | null> {
  try {
    // Create Basic Auth header
    const authHeader = "Basic " + btoa(`${username}:${password}`);

    const response = await apiFetch<ApiResponse<User>>("/login", {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === "success" && response.data) {
      toast.success("Login successful");
      return response.data;
    }
    
    return null;
  } catch (error) {
    toast.error("Login failed. Please check your credentials.");
    return null;
  }
}

export async function logout(): Promise<boolean> {
  try {
    // In a real app, you'd call a logout endpoint
    // For now, we'll just simulate success
    
    // Clear session storage
    sessionStorage.removeItem("user");
    
    return true;
  } catch (error) {
    return false;
  }
}

export function getCurrentUser(): User | null {
  const userJson = sessionStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (e) {
    return null;
  }
}

export function saveUser(user: User): void {
  sessionStorage.setItem("user", JSON.stringify(user));
}
