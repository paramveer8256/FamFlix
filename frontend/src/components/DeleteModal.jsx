import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="bg-gray-900 text-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={onClose}
            >
              <X className="size-5" />
            </button>

            {/* Title */}
            <h2
              className={`text-xl font-bold mb-2 ${
                title === "Update Profile"
                  ? "text-blue-500"
                  : "text-red-500"
              }`}
            >
              {title}
            </h2>

            {/* Message */}
            <p className="text-sm font-bold text-gray-300 mb-6">
              {message}
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`px-4 py-2 rounded ${
                  title === "Update Profile"
                    ? "bg-blue-500 hover:bg-blue-700"
                    : "bg-red-600 hover:bg-red-700"
                } transition text-sm font-semibold`}
              >
                {title === "Update Profile"
                  ? "Update"
                  : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
