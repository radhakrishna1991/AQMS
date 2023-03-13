import React from "react";

export default function Pagination({
  tableRowsPerPage,
  totalData,
  paginateData,
  currentPage,
  numberofpages
}) {
  const pageNumbers = [];
  for (let i = 0; i < numberofpages; i++) {
    pageNumbers.push(i+1);
  }

  return (
    <div className="">
        <div className="hint-text">Showing <b>{tableRowsPerPage}</b> out of <b>{totalData}</b> entries</div>
        <ul className="pagination">
        <li className="page-item" style={{visibility:currentPage==1?"hidden":"visible"}} onClick={() => paginateData(currentPage-1,"prev")}><a className="page-link">Previous</a></li>
                    {pageNumbers.map((page, index) => (
          <li key={index} onClick={() => paginateData(page)} className="page-item">
            <a  className={currentPage==page?"page-link active":"page-link"}>{page}</a>
          </li>
                    )
                    )}
                   <li className="page-item" style={{visibility:currentPage==numberofpages?"hidden":"visible"}} onClick={() => paginateData(currentPage+1,"next")} ><a className="page-link">Next</a></li>
                </ul>
                </div>
  );
}
