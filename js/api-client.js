// API Client for Change Management System
// Handles all backend communication

const API_BASE_URL = 'http://localhost:1337/api'; // Update this to your Strapi backend URL

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    /**
     * Create a new change request
     */
    async createChangeRequest(requestData) {
        try {
            const response = await this.request('/change-requests/create', {
                method: 'POST',
                body: JSON.stringify(requestData),
            });
            return response;
        } catch (error) {
            console.error('Failed to create change request:', error);
            throw error;
        }
    }

    /**
     * Get all change requests
     */
    async getAllChangeRequests() {
        try {
            return await this.request('/change-requests', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Failed to fetch change requests:', error);
            throw error;
        }
    }

    /**
     * Get a single change request by ID
     */
    async getChangeRequest(id) {
        try {
            return await this.request(`/change-requests/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error(`Failed to fetch change request ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get change requests by staff ID
     */
    async getChangeRequestsByStaff(staffId) {
        try {
            return await this.request(`/change-requests/staff/${staffId}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error(`Failed to fetch requests for staff ${staffId}:`, error);
            throw error;
        }
    }

    /**
     * Get change requests by department
     */
    async getChangeRequestsByDepartment(departmentId) {
        try {
            return await this.request(`/change-requests/department/${departmentId}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error(`Failed to fetch requests for department ${departmentId}:`, error);
            throw error;
        }
    }

    /**
     * Get change requests by status
     */
    async getChangeRequestsByStatus(status) {
        try {
            return await this.request(`/change-requests/status/${status}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error(`Failed to fetch requests with status ${status}:`, error);
            throw error;
        }
    }

    /**
     * Update change request status
     */
    async updateRequestStatus(id, status) {
        try {
            return await this.request(`/change-requests/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ request_status: status }),
            });
        } catch (error) {
            console.error(`Failed to update status for request ${id}:`, error);
            throw error;
        }
    }

    /**
     * Update change request
     */
    async updateChangeRequest(id, updateData) {
        try {
            return await this.request(`/change-requests/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });
        } catch (error) {
            console.error(`Failed to update request ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete change request
     */
    async deleteChangeRequest(id) {
        try {
            return await this.request(`/change-requests/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error(`Failed to delete request ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get statistics
     */
    async getStatistics() {
        try {
            return await this.request('/change-requests/statistics', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
            throw error;
        }
    }

    /**
     * Get all departments
     */
    async getDepartments() {
        try {
            return await this.request('/departments', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            throw error;
        }
    }

    /**
     * Get all change types
     */
    async getChangeTypes() {
        try {
            return await this.request('/change-ms-change-types', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Failed to fetch change types:', error);
            throw error;
        }
    }

    /**
     * Get all sections
     */
    async getSections() {
        try {
            return await this.request('/change-ms-sections', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Failed to fetch sections:', error);
            throw error;
        }
    }

    /**
     * Get staff by ID
     */
    async getStaff(staffId) {
        try {
            return await this.request(`/staff/${staffId}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error(`Failed to fetch staff ${staffId}:`, error);
            throw error;
        }
    }

    /**
    * Get sections by department ID
    */
    async getSectionsByDepartment(departmentId) {
        try {
            return await this.request(`/change-ms-sections?filters[department][id][$eq]=${departmentId}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error(`Failed to fetch sections for department ${departmentId}:`, error);
            throw error;
        }
    }

        /**
     * Get HOD reviews by status
     */
    async getHODReviewsByStatus(status) {
        try {
            return await this.request(`/hod-reviews/status/${status}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error(`Failed to fetch HOD reviews with status ${status}:`, error);
            throw error;
        }
    }

    /**
     * Get HOD reviews needing clarification
     */
    async getHODReviewsNeedingClarification() {
        try {
            return await this.request('/hod-reviews/needing-clarification', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Failed to fetch HOD reviews needing clarification:', error);
            throw error;
        }
    }

    /**
     * Create HOD review
     */
    async createHODReview(reviewData) {
        try {
            return await this.request('/hod-reviews/create', {
                method: 'POST',
                body: JSON.stringify(reviewData),
            });
        } catch (error) {
            console.error('Failed to create HOD review:', error);
            throw error;
        }
    }

    /**
     * Update HOD review
     */
    async updateHODReview(id, reviewData) {
        try {
            return await this.request(`/hod-reviews/${id}`, {
                method: 'PUT',
                body: JSON.stringify(reviewData),
            });
        } catch (error) {
            console.error(`Failed to update HOD review ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get HOD review statistics
     */
    async getHODReviewStatistics() {
        try {
            return await this.request('/hod-reviews/statistics', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Failed to fetch HOD review statistics:', error);
            throw error;
        }
    }

        /**
     * Submit clarification response
     */
    async submitClarificationResponse(id, response) {
        try {
            return await this.request(`/change-requests/${id}/clarification-response`, {
                method: 'PUT',
                body: JSON.stringify({ clarification_response: response }),
            });
        } catch (error) {
            console.error(`Failed to submit clarification response for request ${id}:`, error);
            throw error;
        }
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
window.apiClient = apiClient; // Make it available globally