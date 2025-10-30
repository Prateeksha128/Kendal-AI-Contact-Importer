"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Download } from "lucide-react";
import ReactPaginate from "react-paginate";
import { getDocuments } from "@/lib/firestore";
import { Contact, User, ContactField } from "@/types";
import { formatDate, getCoreFields } from "@/utils/helper";
import LoadingSpinner from "../LoadingSpinner";
import { auth } from "@/lib/firebase";

export default function ContactsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [coreFields, setCoreFields] = useState<ContactField[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const loading = contactsLoading || usersLoading || fieldsLoading;

  // Fetch functions
  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      const response = await getDocuments<Contact>("contacts");
      if (response.success && response.data) {
        setContacts(response.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await getDocuments<User>("users");
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setUsersLoading(false);
    }
  };
  const fetchCoreFields = async () => {
    try {
      setFieldsLoading(true);
      const fields = await getCoreFields();

      // Filter out agentUid and enforce order
      const filtered = fields.filter((field) => field.label !== "agentUid");

      // Define preferred order
      const preferredOrder = ["firstName", "lastName", "email", "phone"];

      // Sort according to preferred order (rest fields stay at end)
      const orderedFields = filtered.sort((a, b) => {
        const indexA = preferredOrder.indexOf(a.label);
        const indexB = preferredOrder.indexOf(b.label);
        if (indexA === -1 && indexB === -1) return 0; // both not in order list
        if (indexA === -1) return 1; // a comes after ordered ones
        if (indexB === -1) return -1; // b comes after ordered ones
        return indexA - indexB;
      });

      setCoreFields(orderedFields);
    } catch (error) {
      console.error("Error fetching core fields:", error);
    } finally {
      setFieldsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchContacts();
    fetchUsers();
    fetchCoreFields();
  }, []);

  // Map uid → userEmail for displaying agent
  const uidToEmail = useMemo(() => {
    const map: Record<string, string> = {};
    users.forEach((user) => {
      if (user.uid && user.email) map[user.uid] = user.email;
    });
    return map;
  }, [users]);

  // Filter by search
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;
    const term = searchTerm.toLowerCase();
    return contacts.filter(
      (c) =>
        c.firstName?.toLowerCase().includes(term) ||
        c.lastName?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        uidToEmail[c.agentUid || ""]?.toLowerCase().includes(term)
    );
  }, [contacts, searchTerm, uidToEmail]);

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    setIsPageChanging(true);
    // Simulate data loading time
    setTimeout(() => setIsPageChanging(false), 100);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleImportClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", "import");
    router.push(`?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Contacts</h2>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 cursor-pointer bg-[#0E4259] text-white px-4 py-2 rounded-lg hover:bg-[#155A75] transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            Import
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 text-[#0E4259] " />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border text-[#0E4259]  border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm
            ? "No contacts found matching your search."
            : "No contacts found."}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="relative">
              {isPageChanging && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="md" color="blue" />
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                </div>
              )}
              <table className="min-w-full bg-white border border-gray-200 rounded-lg transition-opacity duration-200">
                <thead className="bg-gray-50">
                  <tr>
                    {coreFields.map((field) => (
                      <th
                        key={field.id}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {field.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {coreFields.map((field) => (
                        <td
                          key={field.id}
                          className="px-4 py-3 text-sm text-gray-900"
                        >
                          {String(
                            (contact as Record<string, unknown>)[field.label] ||
                              "—"
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {uidToEmail[contact.agentUid || ""] || "-----"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(contact.createdOn)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {(contact.lastUpdatedBy as string) || "-----"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination footer */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">per page</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                {startIndex + 1}-{Math.min(endIndex, filteredContacts.length)}{" "}
                of {filteredContacts.length}
              </span>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                forcePage={currentPage}
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                containerClassName="flex  items-center space-x-1 flex-wrap justify-center"
                pageClassName="px-2 sm:px-3 hover:bg-gray-200  py-2 text-sm border border-gray-300 rounded cursor-pointer"
                pageLinkClassName="text-gray-700"
                activeClassName="bg-blue-500 text-white border-blue-500"
                activeLinkClassName="text-white"
                previousClassName="px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                nextClassName="px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                previousLinkClassName="text-gray-700"
                nextLinkClassName="text-gray-700"
                disabledClassName="opacity-50 cursor-not-allowed"
                disabledLinkClassName="cursor-not-allowed"
                breakClassName="px-2 sm:px-3 py-2 text-sm text-gray-500"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
