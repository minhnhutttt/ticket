import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";
// Firebase
import { problemSolving } from "../../firebase.util";
import { useState } from "react";
const ChatSidebar = ({ ticketID, subject, name,  email, message, status, role }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }
  const handle = () => {
    problemSolving(ticketID);
  }
  return (
    <>
    <div className="flex flex-col  w-full p-6 break-words ">
      <div className="hidden md:flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full p-4 text-white overflow-auto bg-gradient border-gray-400 border shadow-lg ">
        <h1 className="text-2xl font-bold capitalize">{subject}</h1>
        <div className="text-xl flex items-center gap-4 mt-6 font-thin">
          <h2 className="font-bold">Name:</h2>
          <h2>{name}</h2>
        </div>
        <div className="text-xl flex items-center gap-4 mt-6 font-thin">
          <h2 className="font-bold">Email:</h2>
          <h2 className="text-base">{email} </h2>
        </div>
        <div className="text-xl flex items-center gap-4 mt-6 font-thin">
          <h2 className="font-bold">Initial Message:</h2>
          <p className="text-base">{message}</p>
        </div>
        <div className="flex items-center justify-between  mt-6 ">
          <div className="flex items-center text-xl font-thin">
            <h2 className="font-bold">Status</h2>
            <div className="flex ml-5">
            <div
                  className={`flex w-32 text-center justify-center items-center
                  rounded-full
                  py-2 px-6 leading-none
                    select-none capitalize ${status === 'closed' ? 'bg-gray-300 text-black/80' : 'bg-green-500 text-white  '}`}
                >
                  <span>{status}</span>
                </div>
            </div>
          </div>
          {role === 'admin' &&
            <div className="flex ml-5">
              <button
                onClick={openModal}
                className="flex items-center
                    rounded-full
                    py-2 px-6 leading-none
                      select-none text-white bg-red-700 capitalize "
              >
                <span>Close Ticket</span>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
    <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalHeader>Closing ticket</ModalHeader>
            <ModalBody>Are you sure you want to close this ticket?</ModalBody>
            <ModalFooter>
              <Button
                className="w-full sm:w-auto"
                layout="outline"
                onClick={closeModal}
              >
                No
              </Button>
              <Button
                onClick={()=> handle()}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
              >
                Yes
              </Button>
            </ModalFooter>
          </Modal>
    </>
  );
};

export default ChatSidebar;
