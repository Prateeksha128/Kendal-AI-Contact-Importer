"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import ReactPaginate from "react-paginate";
import { getDocuments } from "@/lib/firestore";
import { Contact } from "@/types";
import { formatDate } from "@/utils/helper";

export default function ContactsTable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Fetch contacts from Firestore
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const response = await getDocuments<Contact>("contacts", {
          orderByField: "createdOn",
          orderDirection: "desc",
        });

        if (response.success && response.data) {
          setContacts(response.data);
        } else {
          console.error("Error fetching contacts:", response.error);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter contacts based on search term
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;

    const term = searchTerm.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.firstName?.toLowerCase().includes(term) ||
        contact.lastName?.toLowerCase().includes(term) ||
        contact.phone?.toLowerCase().includes(term) ||
        contact.email?.toLowerCase().includes(term) ||
        contact.agentUid?.toLowerCase().includes(term)
    );
  }, [contacts, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">Contacts</h2>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? "No contacts found matching your search."
              : "No contacts found."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {contact.phone || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {contact.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {contact.agentUid || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(contact.createdOn)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

          {/* React Paginate */}
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
                containerClassName="flex items-center space-x-1 flex-wrap justify-center"
                pageClassName="px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
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
