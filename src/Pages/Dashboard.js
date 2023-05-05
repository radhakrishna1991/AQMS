import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

  const [ListAllData, setListAllData] = useState();

  useEffect(() => {
    fetch(process.env.REACT_APP_WSurl + "api/Dashboard", {
      method: 'GET',
    }).then((response) => response.json())
      .then((data) => {
        if (data) {
          setListAllData(data);
        }
      }).catch((error) => toast.error('Unable to get the data. Please contact adminstrator'));
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Line Chart',
      },
    },
  };
  
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [-10,5,20,6,-20,20],
        borderColor: 'rgb(30, 64, 175)',
        backgroundColor: 'rgba(30, 64, 175, 0.5)',
      }
    ],
  };
  return (
    <main id="main" className="main">

      <div className="pagetitle">
        <h1>Dashboard</h1>
        {/* <nav>
    <ol className="breadcrumb">
      <li className="breadcrumb-item"><a href="index.html">Home</a></li>
      <li className="breadcrumb-item active">Dashboard</li>
    </ol>
  </nav> */}
      </div>

      <section className="section dashboard">
        {ListAllData && (
          <div className="row">

            <div className="col-lg-12">
              <div className="row" style={{display:"none"}}>

                <div className="col-xxl-4 col-md-4">
                  <div className="card info-card sales-card">

                    {/*  <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div> */}

                    <div className="card-body">
                      <h5 className="card-title text-center">Stations</h5>

                      <div className="align-items-center text-center">
                        {/* <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-cart"></i>
                </div> */}
                        <div className="ps-3">
                          <h6>{ListAllData.listStations.length}</h6>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="col-xxl-4 col-md-4">
                  <div className="card info-card revenue-card">
                    {/* 
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div> */}

                    <div className="card-body">
                      <h5 className="card-title text-center">Devices</h5>

                      <div className="align-items-center text-center">
                        {/* <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-currency-dollar"></i>
                </div> */}
                        <div className="ps-3">
                          <h6>{ListAllData.listDevices.length}</h6>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="col-xxl-4 col-md-4">

                  <div className="card info-card customers-card">

                    {/*     <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div> */}

                    <div className="card-body">
                      <h5 className="card-title text-center">Parameters</h5>

                      <div className="align-items-center text-center">
                        {/*  <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                  <i className="bi bi-people"></i>
                </div> */}
                        <div className="ps-3 text-center">
                          <h6>{ListAllData.listPollutents.length}</h6>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/*  <div className="col-12">
          <div className="card">

            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body">
              <h5 className="card-title">Reports <span>/Today</span></h5>
              <div id="reportsChart"></div>
            </div>

          </div>
        </div>

        <div className="col-12">
          <div className="card recent-sales overflow-auto">

            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body">
              <h5 className="card-title">Recent Sales <span>| Today</span></h5>

              <table className="table table-borderless datatable">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row"><a href="#">#2457</a></th>
                    <td>Brandon Jacob</td>
                    <td><a href="#" className="text-primary">At praesentium minu</a></td>
                    <td>$64</td>
                    <td><span className="badge bg-success">Approved</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2147</a></th>
                    <td>Bridie Kessler</td>
                    <td><a href="#" className="text-primary">Blanditiis dolor omnis similique</a></td>
                    <td>$47</td>
                    <td><span className="badge bg-warning">Pending</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2049</a></th>
                    <td>Ashleigh Langosh</td>
                    <td><a href="#" className="text-primary">At recusandae consectetur</a></td>
                    <td>$147</td>
                    <td><span className="badge bg-success">Approved</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2644</a></th>
                    <td>Angus Grady</td>
                    <td><a href="#" className="text-primar">Ut voluptatem id earum et</a></td>
                    <td>$67</td>
                    <td><span className="badge bg-danger">Rejected</span></td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#">#2644</a></th>
                    <td>Raheem Lehner</td>
                    <td><a href="#" className="text-primary">Sunt similique distinctio</a></td>
                    <td>$165</td>
                    <td><span className="badge bg-success">Approved</span></td>
                  </tr>
                </tbody>
              </table>

            </div>

          </div>
        </div>

        <div className="col-12">
          <div className="card top-selling overflow-auto">

            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body pb-0">
              <h5 className="card-title">Top Selling <span>| Today</span></h5>

              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">Preview</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Sold</th>
                    <th scope="col">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-1.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Ut inventore ipsa voluptas nulla</a></td>
                    <td>$64</td>
                    <td className="fw-bold">124</td>
                    <td>$5,828</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-2.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Exercitationem similique doloremque</a></td>
                    <td>$46</td>
                    <td className="fw-bold">98</td>
                    <td>$4,508</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-3.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Doloribus nisi exercitationem</a></td>
                    <td>$59</td>
                    <td className="fw-bold">74</td>
                    <td>$4,366</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-4.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Officiis quaerat sint rerum error</a></td>
                    <td>$32</td>
                    <td className="fw-bold">63</td>
                    <td>$2,016</td>
                  </tr>
                  <tr>
                    <th scope="row"><a href="#"><img src="assets/img/product-5.jpg" alt=""/></a></th>
                    <td><a href="#" className="text-primary fw-bold">Sit unde debitis delectus repellendus</a></td>
                    <td>$79</td>
                    <td className="fw-bold">41</td>
                    <td>$3,239</td>
                  </tr>
                </tbody>
              </table>

            </div>

          </div>
        </div> */}

              </div>

              <div className="row">

              <div className=" col-md-3">
                  <div className="card info-card revenue-card">
                    <div className="card-body ">
                      <div className="d-flex justify-content-between mb-2">
                      <div className="icons"><i className="bi bi-sliders2-vertical"></i></div>
                      <div className="device">O3 42 M</div>
                      <div className="icons"><i className="bi bi-info-circle"></i></div>
                      </div>
                      <div className="d-flex justify-content-start mb-2">
                      <div className="icons"><i className="bi bi-exclamation-triangle"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      </div>
                      <div className="d-flex justify-content-between">
                      <div className="parameter"><i className="bi bi-check2"></i> <span>MS-O3</span></div>
                      <div className="values"><button className="btn1">A</button> <button className="btn2">24</button></div>
                      <div className="icons"><i className="bi bi-graph-up"></i></div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className=" col-md-3">
                  <div className="card info-card revenue-card">
                    <div className="card-body ">
                      <div className="d-flex justify-content-between mb-2">
                      <div className="icons"><i className="bi bi-sliders2-vertical"></i></div>
                      <div className="device">O3 42 M</div>
                      <div className="icons"><i className="bi bi-info-circle"></i></div>
                      </div>
                      <div className="d-flex justify-content-start mb-2">
                      <div className="icons"><i className="bi bi-exclamation-triangle"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      </div>
                      <div className="d-flex justify-content-between">
                      <div className="parameter"><i className="bi bi-check2"></i> <span>MS-O3</span></div>
                      <div className="values"><button className="btn1">A</button> <button className="btn2">24</button></div>
                      <div className="icons"><i className="bi bi-graph-up"></i></div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className=" col-md-3">
                  <div className="card info-card revenue-card">
                    <div className="card-body ">
                      <div className="d-flex justify-content-between mb-2">
                      <div className="icons"><i class="bi bi-sliders2-vertical"></i></div>
                      <div className="device">O3 42 M</div>
                      <div className="icons"><i className="bi bi-info-circle"></i></div>
                      </div>
                      <div className="d-flex justify-content-start mb-2">
                      <div className="icons"><i className="bi bi-exclamation-triangle"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      </div>
                      <div className="d-flex justify-content-between">
                      <div className="parameter"><i className="bi bi-check2"></i> <span>MS-O3</span></div>
                      <div className="values"><button className="btn1">A</button> <button className="btn2">24</button></div>
                      <div className="icons"><i className="bi bi-graph-up"></i></div>
                      </div>
                    </div>

                  </div>
                </div>
                <div className=" col-md-3">
                  <div className="card info-card revenue-card">
                    <div className="card-body ">
                      <div className="d-flex justify-content-between mb-2">
                      <div className="icons"><i className="bi bi-sliders2-vertical"></i></div>
                      <div className="device">O3 42 M</div>
                      <div className="icons"><i className="bi bi-info-circle"></i></div>
                      </div>
                      <div className="d-flex justify-content-start mb-2">
                      <div className="icons"><i className="bi bi-exclamation-triangle"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      <div className="icons"><i className="bi bi-lightbulb"></i></div>
                      </div>
                      <div className="d-flex justify-content-between">
                      <div className="parameter"><i className="bi bi-check2"></i> <span>MS-O3</span></div>
                      <div className="values"><button className="btn1">A</button> <button className="btn2">24</button></div>
                      <div className="icons"><i className="bi bi-graph-up"></i></div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className="row">
              <Line options={options} data={data} />;
              </div>
            </div>

            {/* 
    <div className="col-lg-4">
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body">
          <h5 className="card-title">Recent Activity <span>| Today</span></h5>

          <div className="activity">

            <div className="activity-item d-flex">
              <div className="activite-label">32 min</div>
              <i className='bi bi-circle-fill activity-badge text-success align-self-start'></i>
              <div className="activity-content">
                Quia quae rerum <a href="#" className="fw-bold text-dark">explicabo officiis</a> beatae
              </div>
            </div>
            <div className="activity-item d-flex">
              <div className="activite-label">56 min</div>
              <i className='bi bi-circle-fill activity-badge text-danger align-self-start'></i>
              <div className="activity-content">
                Voluptatem blanditiis blanditiis eveniet
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">2 hrs</div>
              <i className='bi bi-circle-fill activity-badge text-primary align-self-start'></i>
              <div className="activity-content">
                Voluptates corrupti molestias voluptatem
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">1 day</div>
              <i className='bi bi-circle-fill activity-badge text-info align-self-start'></i>
              <div className="activity-content">
                Tempore autem saepe <a href="#" className="fw-bold text-dark">occaecati voluptatem</a> tempore
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">2 days</div>
              <i className='bi bi-circle-fill activity-badge text-warning align-self-start'></i>
              <div className="activity-content">
                Est sit eum reiciendis exercitationem
              </div>
            </div>

            <div className="activity-item d-flex">
              <div className="activite-label">4 weeks</div>
              <i className='bi bi-circle-fill activity-badge text-muted align-self-start'></i>
              <div className="activity-content">
                Dicta dolorem harum nulla eius. Ut quidem quidem sit quas
              </div>
            </div>

          </div>

        </div>
      </div>

      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body pb-0">
          <h5 className="card-title">Budget Report <span>| This Month</span></h5>

          <div id="budgetChart"  className="echart"></div>

        </div>
      </div>
      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body pb-0">
          <h5 className="card-title">Website Traffic <span>| Today</span></h5>

          <div id="trafficChart"  className="echart"></div>


        </div>
      </div>

      <div className="card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>

            <li><a className="dropdown-item" href="#">Today</a></li>
            <li><a className="dropdown-item" href="#">This Month</a></li>
            <li><a className="dropdown-item" href="#">This Year</a></li>
          </ul>
        </div>

        <div className="card-body pb-0">
          <h5 className="card-title">News &amp; Updates <span>| Today</span></h5>

          <div className="news">
            <div className="post-item clearfix">
              <img src="assets/img/news-1.jpg" alt="" />
              <h4><a href="#">Nihil blanditiis at in nihil autem</a></h4>
              <p>Sit recusandae non aspernatur laboriosam. Quia enim eligendi sed ut harum...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-2.jpg" alt="" />
              <h4><a href="#">Quidem autem et impedit</a></h4>
              <p>Illo nemo neque maiores vitae officiis cum eum turos elan dries werona nande...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-3.jpg" alt="" />
              <h4><a href="#">Id quia et et ut maxime similique occaecati ut</a></h4>
              <p>Fugiat voluptas vero eaque accusantium eos. Consequuntur sed ipsam et totam...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-4.jpg" alt="" />
              <h4><a href="#">Laborum corporis quo dara net para</a></h4>
              <p>Qui enim quia optio. Eligendi aut asperiores enim repellendusvel rerum cuder...</p>
            </div>

            <div className="post-item clearfix">
              <img src="assets/img/news-5.jpg" alt="" />
              <h4><a href="#">Et dolores corrupti quae illo quod dolor</a></h4>
              <p>Odit ut eveniet modi reiciendis. Atque cupiditate libero beatae dignissimos eius...</p>
            </div>

          </div>

        </div>
      </div>

    </div> */}

          </div>
        )}
      </section>

    </main>
  );
}
export default Dashboard;