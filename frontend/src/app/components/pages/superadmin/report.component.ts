import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from 'src/app/services/adminauth.service'; 
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  customerReports: any[] = []; // Define an array to hold customer reports
  catererReports: any[] = []; // Define an array to hold caterer reports
  settledReports: any[] = [];
  showCustomerReports = true;
  showCatererReports = false;
  showSettledReports = false;
  searchTerm: string = '';
  filteredReports: Report[] = [];
  constructor(private adminauthservice: AdminAuthService, private router:Router, private afs:AngularFirestore) {}

  ngOnInit() {
    // Fetch customer reports from your backend
    this.adminauthservice.getCustomerReports().subscribe((reports) => {
      this.customerReports = reports;
    });

    // Fetch caterer reports from your backend
    this.adminauthservice.getCatererReports().subscribe((reports) => {
      this.catererReports = reports;
    });

    this.adminauthservice.getSettledReports().subscribe((reports)=> {
      this.settledReports = reports;
    });

    

  }

  goToStatus(reportedUsername: string, userType: string) {
    const queryParams = { reportedUsername }; // Create queryParams object with reportedUsername
  
    if (userType === 'caterer') {
      this.router.navigate(['/superadmin-customer'], { queryParams }); // Navigate to the Superadmin Customer route with queryParams
    } else if (userType === 'customer') {
      this.router.navigate(['/superadmin'], { queryParams }); // Navigate to the Superadmin route with queryParams
    }
  }




  getReportId(reportedUsername: string, userType: string): Promise<string | null> {
    const collectionRef = this.afs.collection('reports')
                          .doc(userType)
                          .collection('details', ref => ref.where('reportedUsername', '==', reportedUsername));

    return collectionRef.get().toPromise().then(querySnapshot => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return doc.id;
      } else {
        return null;
      }
    }).catch(error => {
      console.error('Error getting document:', error);
      return null;
    });
  }

  

  markAsSettled(reportedUsername: string, userType: string) {
    this.getReportId(reportedUsername, userType).then((reportId) => {
      if (reportId) {
        const reportRef = this.afs.collection('reports')
          .doc(userType)
          .collection('details')
          .doc(reportId);
  
        const settledCollectionRef = this.afs.collection('settled').doc(userType).collection('details');
  
        reportRef.get().subscribe((doc) => {
          if (doc.exists) {
            const data = doc.data();
            if (data) {
              settledCollectionRef.doc(reportedUsername).get().subscribe((settledDoc) => {
                if (settledDoc.exists) {
                  const settledData = settledDoc.data();
                  if (settledData) {
                    const currentDetails = settledData.reportDetails || '';
                    const newDetails = `${currentDetails}\n- ${data.reportDetails}`;
                    settledDoc.ref.update({ reportDetails: newDetails }).then(() => {
                      reportRef.delete().then(() => {
                        console.log('Report marked as settled successfully.');
                      }).catch((error) => {
                        console.error('Error removing report:', error);
                      });
                    }).catch((error) => {
                      console.error('Error updating settled report:', error);
                    });
                  } else {
                    console.error('Settled document data is undefined.');
                  }
                } else {
                  settledCollectionRef.doc(reportedUsername).set({
                    reportedUsername: data.reportedUsername,
                    reportDetails: data.reportDetails,
                    count: data.count, // Assuming this is the initial count for new reports
                    userType: data.userType
                  }).then(() => {
                    reportRef.delete().then(() => {
                      console.log('Report marked as settled successfully.');
                    }).catch((error) => {
                      console.error('Error removing report:', error);
                    });
                  }).catch((error) => {
                    console.error('Error adding to settled collection:', error);
                  });
                }
              });
            } else {
              console.error('Document data is undefined.');
            }
          } else {
            console.error('Report document does not exist.');
          }
        });
      } else {
        console.error('Report ID not found.');
      }
    });
  }
  
}
  
  
  

