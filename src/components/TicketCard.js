import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Firebase
import { getChatFromDB, db, deleteTicket, getUser } from "../firebase.util";

import Spinner from "./Spinner";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@windmill/react-ui";

// Redux
import { connect } from "react-redux";

const TicketCard = ({ ticket, currentUser }) => {
  const [isTicketOpened, setTicketOpened] = useState(null); // State to store whether ticket has opened or not
  // if admin has sent the last message it has opened

  const [isModalOpen, setIsModalOpen] = useState(false);
  function openModal() {
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  const toDateTime = (secs) => {
    // Convert Timestamp stored in database to readable date
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return t.toLocaleDateString("en-UK", options).toString();
  };

  // Check if the last message is an admin message
  const checkTicketIsOpened = () => {
    getChatFromDB(ticket.id).then((dialogs) => {
      // Get all the chats related to this ticket

      // if there is any dialogs on it, get the last one
      if (dialogs) var lastChat = dialogs.slice(-1)[0];
      //  check who owns the last message?
      if (lastChat) {
        db.collection("users")
          .doc(lastChat.owner)
          .get()
          .then((doc) => {
            if (doc.data().role === "admin") setTicketOpened(true);
            // if it's an admin message so flag it as opned ticket
            else setTicketOpened(false);
          });
      } else setTicketOpened(false); // if there was no message on this ticket
    });
  };

  useEffect(() => {
    checkTicketIsOpened();
    // eslint-disable-next-line
  }, []);

  const [avatar, setAvatar] = useState('');
  getUser(ticket.owner).then(user => {
    setAvatar(user.data().profileURL)
  })

  var classString =
    "flex w-5/6 mx-auto	-my-0 items-center justify-between bg-white px-8 py-6 border-indigo-500 shadow-lg ";
  classString += isTicketOpened ? " " : "border-l-4";

  return (
    <div>
      {isTicketOpened !== null ? (
        <div>
          <div className="flex flex-col mt-4">
            <div className="flex flex-row mt-2">
              <div className={classString}>
                <div className="flex">
                  {/* <img
                    className="h-12 w-12 rounded-full object-cover"
                    src="https://hackap.ir/wp-content/uploads/2021/04/profile.png"
                    alt="infamous"
                  /> */}
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={avatar}
                    alt="infamous"
                  />


                  <div className="flex flex-col ml-6">
                    <span className="text-lg font-bold">{ticket.subject}</span>
                    
                    <div className="flex items-center mt-2">
                      <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM7.63 18.15C7.63 18.56 7.29 18.9 6.88 18.9C6.47 18.9 6.13 18.56 6.13 18.15V16.08C6.13 15.67 6.47 15.33 6.88 15.33C7.29 15.33 7.63 15.67 7.63 16.08V18.15ZM12.75 18.15C12.75 18.56 12.41 18.9 12 18.9C11.59 18.9 11.25 18.56 11.25 18.15V14C11.25 13.59 11.59 13.25 12 13.25C12.41 13.25 12.75 13.59 12.75 14V18.15ZM17.87 18.15C17.87 18.56 17.53 18.9 17.12 18.9C16.71 18.9 16.37 18.56 16.37 18.15V11.93C16.37 11.52 16.71 11.18 17.12 11.18C17.53 11.18 17.87 11.52 17.87 11.93V18.15ZM17.87 8.77C17.87 9.18 17.53 9.52 17.12 9.52C16.71 9.52 16.37 9.18 16.37 8.77V7.8C13.82 10.42 10.63 12.27 7.06 13.16C7 13.18 6.94 13.18 6.88 13.18C6.54 13.18 6.24 12.95 6.15 12.61C6.05 12.21 6.29 11.8 6.7 11.7C10.07 10.86 13.07 9.09 15.45 6.59H14.2C13.79 6.59 13.45 6.25 13.45 5.84C13.45 5.43 13.79 5.09 14.2 5.09H17.13C17.17 5.09 17.2 5.11 17.24 5.11C17.29 5.12 17.34 5.12 17.39 5.14C17.44 5.16 17.48 5.19 17.53 5.22C17.56 5.24 17.59 5.25 17.62 5.27C17.63 5.28 17.63 5.29 17.64 5.29C17.68 5.33 17.71 5.37 17.74 5.41C17.77 5.45 17.8 5.48 17.81 5.52C17.83 5.56 17.83 5.6 17.84 5.65C17.85 5.7 17.87 5.75 17.87 5.81C17.87 5.82 17.88 5.83 17.88 5.84V8.77H17.87Z" fill="#292D32" />
                      </svg>

                      <span
                        className="ml-2 text-sm text-gray-600
										 capitalize"
                      >
                        <div className="flex">
                          <div
                            className={`flex w-32 text-center justify-center items-center
                            rounded-full
                            py-2 px-6 leading-none
                             select-none capitalize ${ticket.status === 'closed' ? 'bg-gray-300 text-black/80' : 'bg-green-500 text-white  '}`}
                          >
                            <span>{ticket.status}</span>
                          </div>
                        </div>
                      </span>
                    </div>
                    <div className="mt-4 flex">
                      <div className="flex">
                        <svg
                          className="h-5 w-5 fill-current
											"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 4a4 4 0 014 4 4 4 0 01-4 4
												4 4 0 01-4-4 4 4 0 014-4m0
												10c4.42 0 8 1.79 8
												4v2H4v-2c0-2.21 3.58-4 8-4z"
                          ></path>
                        </svg>
                        <span
                          className="ml-2 text-sm text-gray-600
											 capitalize"
                        >
                          {ticket.name}
                        </span>
                      </div>

                      <div className="flex ml-6">
                        <svg
                          className="h-5 w-5 fill-current
											"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19
												19H5V8h14m-3-7v2H8V1H6v2H5c-1.11
												0-2 .89-2 2v14a2 2 0 002 2h14a2 2
												0 002-2V5a2 2 0 00-2-2h-1V1m-1
												11h-5v5h5v-5z"
                          ></path>
                        </svg>
                        <span
                          className="ml-2 text-sm text-gray-600
											 capitalize"
                        >
                          {toDateTime(ticket.createdAt.seconds)}
                        </span>
                      </div>

                      <div className="flex ml-6">
                        <img
                          src="data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' aria-labelledby='title' aria-describedby='desc' role='img' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3EEnvelope%3C/title%3E%3Cdesc%3EA line styled icon from Orion Icon Library.%3C/desc%3E%3Cpath data-name='layer2' fill='none' stroke='%23202020' stroke-miterlimit='10' stroke-width='2' d='M2 12l30 27.4L62 12' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3Cpath data-name='layer1' fill='none' stroke='%23202020' stroke-miterlimit='10' stroke-width='2' d='M2 12h60v40H2z' stroke-linejoin='round' stroke-linecap='round'%3E%3C/path%3E%3C/svg%3E"
                          alt="Ticket email"
                          width="20"
                        />

                        <span
                          className="ml-2 text-sm text-gray-600
										 capitalize"
                        >
                          {ticket.email}
                        </span>
                      </div>
                    </div>


                    <div className="flex">
                      <div className="mt-4 flex">
                        <Link
                          // Send ticket data to chat box via url params
                          to={`/profile/${ticket.id}/${ticket.subject}/${ticket.name}/${ticket.owner}/${ticket.email}/${ticket.message}/${ticket.status}`}
                        >
                          <button
                            onClick={checkTicketIsOpened}
                            className="flex items-center
										rounded-full
										py-2 px-6 leading-none
										 select-none text-white bg-gradient"
                          >
                            <span>Show details</span>
                          </button>
                        </Link>
                      </div>
                      {currentUser.role === "admin" ? (
                        // if it's admin let him delete the ticket
                        <div className="ml-4 mt-4 flex">
                          <button
                            onClick={openModal}
                            className="flex items-center
										rounded-full
										py-2 px-6 leading-none
										 select-none text-white bg-red-500"
                          >
                            <span>Delete</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalHeader>Deleting ticket</ModalHeader>
            <ModalBody>Are you sure you want to delete this ticket?</ModalBody>
            <ModalFooter>
              <Button
                className="w-full sm:w-auto"
                layout="outline"
                onClick={closeModal}
              >
                No
              </Button>
              <Button
                onClick={() => deleteTicket(ticket.id)}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
              >
                Yes
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      ) : (
        <Spinner size={28} />
      )}
    </div>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser, // pull current user from redux
});
export default connect(mapStateToProps)(TicketCard);
