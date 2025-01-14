import swal from 'sweetalert2';
import apiServices from './apiServices'; // Import your API service

class DeleteService {
    /**
     * Delete an item dynamically using the route name and ID.
     * @param routeName - The API route name (e.g., "users").
     * @param id - The ID of the item to be deleted.
     * @param fetchCallback - A callback to refresh data after deletion.
     */
    static async deleteItem(
        routeName: string,
        id: string,
        fetchCallback?: () => void
    ) {
        try {
            // Display confirmation dialog
            const result = await swal.fire({
                title: "Kamu Yakin?",
                text: "Kamu yakin ingin menghapus data ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                // Construct the API URL
                const apiUrl = `${routeName}/${id}`;
                const response = await apiServices.deleteData(apiUrl, {}, true);
                if (response.status === 200) {
                    // Show success notification
                    swal.fire({
                        icon: "success",
                        title: "Hapus Data Berhasil",
                        showConfirmButton: false,
                        timer: 1500,
                    });

                    // Refresh data if a callback is provided
                    if (fetchCallback) {
                        fetchCallback();
                    }
                }
            }
        } catch (error) {
            // Handle error and show notification
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    }
}

export default DeleteService;
