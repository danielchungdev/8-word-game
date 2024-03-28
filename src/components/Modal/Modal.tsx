import { FC, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    children: ReactNode;
    unclosable?: boolean
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, children, unclosable = false }) => {
    const modalVariants = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: { y: "0vh", opacity: 1, transition: { delay: 0.1 } },
    };

    const closeButtonVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const exitAnimation = {
        opacity: 0,
        transition: { duration: 0.3 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-500"
                    initial="hidden"
                    animate="visible"
                    exit={exitAnimation}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-lg p-6 z-50 relative"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit={exitAnimation}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!unclosable &&
                            <motion.button
                                onClick={onClose}
                                className="absolute top-3 right-6 text-2xl text-gray-500 hover:text-gray-700 transition-colors"
                                variants={closeButtonVariants}
                            >
                                &times;
                            </motion.button>
                        }

                        <div className="p-2 w-[19rem]">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
