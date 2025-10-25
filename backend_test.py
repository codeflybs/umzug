#!/usr/bin/env python3
"""
Backend API Testing Suite for Multi-Service Offer Management System
Tests all core API endpoints and functionality
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except:
        pass
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_URL = f"{BASE_URL}/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        if not success and response_data:
            print(f"   Response: {response_data}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response': response_data
        })
        
        if not success:
            self.failed_tests.append(test_name)
    
    def test_health_check(self):
        """Test basic API health check"""
        try:
            response = self.session.get(f"{API_URL}/")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "running":
                    self.log_test("API Health Check", True, f"API version: {data.get('version')}")
                    return True
                else:
                    self.log_test("API Health Check", False, "API not running", data)
                    return False
            else:
                self.log_test("API Health Check", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("API Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_authentication(self):
        """Test admin authentication"""
        try:
            # Test login with admin credentials
            login_data = {
                "username": "admin",
                "password": "admin123"
            }
            
            response = self.session.post(f"{API_URL}/auth/login", data=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.auth_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.auth_token}"})
                    user_info = data.get("user", {})
                    self.log_test("Admin Authentication", True, f"Logged in as: {user_info.get('username')} ({user_info.get('role')})")
                    return True
                else:
                    self.log_test("Admin Authentication", False, "No access token in response", data)
                    return False
            else:
                self.log_test("Admin Authentication", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Admin Authentication", False, f"Error: {str(e)}")
            return False
    
    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.auth_token:
            self.log_test("Get Current User", False, "No auth token available")
            return False
            
        try:
            response = self.session.get(f"{API_URL}/auth/me")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("username") == "admin":
                    self.log_test("Get Current User", True, f"User: {data.get('name')} - Role: {data.get('role')}")
                    return True
                else:
                    self.log_test("Get Current User", False, "Unexpected user data", data)
                    return False
            else:
                self.log_test("Get Current User", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Get Current User", False, f"Error: {str(e)}")
            return False
    
    def test_company_settings(self):
        """Test company settings endpoints"""
        try:
            # Test GET company settings (public)
            response = self.session.get(f"{API_URL}/settings/company")
            
            if response.status_code == 200:
                data = response.json()
                if "companyName" in data:
                    self.log_test("Get Company Settings", True, f"Company: {data.get('companyName')}")
                    
                    # Test PUT company settings (admin only)
                    if self.auth_token:
                        update_data = {
                            "companyName": "UNIT-UMZUG.CH",
                            "defaultLanguage": "de"
                        }
                        
                        response = self.session.put(f"{API_URL}/settings/company", data=update_data)
                        
                        if response.status_code == 200:
                            self.log_test("Update Company Settings", True, "Settings updated successfully")
                            return True
                        else:
                            self.log_test("Update Company Settings", False, f"Status code: {response.status_code}", response.text)
                            return False
                    else:
                        self.log_test("Update Company Settings", False, "No auth token")
                        return False
                else:
                    self.log_test("Get Company Settings", False, "Missing company data", data)
                    return False
            else:
                self.log_test("Get Company Settings", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Company Settings", False, f"Error: {str(e)}")
            return False
    
    def test_categories_crud(self):
        """Test service categories CRUD operations"""
        if not self.auth_token:
            self.log_test("Categories CRUD", False, "No auth token available")
            return False
            
        try:
            # Test GET categories
            response = self.session.get(f"{API_URL}/categories")
            
            if response.status_code == 200:
                categories = response.json()
                self.log_test("Get Categories", True, f"Found {len(categories)} categories")
                
                # Test POST new category
                new_category = {
                    "categoryId": "test_category",
                    "name": {
                        "de": "Test Kategorie",
                        "en": "Test Category"
                    },
                    "description": {
                        "de": "Test Beschreibung",
                        "en": "Test Description"
                    },
                    "icon": "test",
                    "active": True,
                    "pricingModel": "fixed",
                    "basePrice": 100.0
                }
                
                response = self.session.post(f"{API_URL}/categories", json=new_category)
                
                if response.status_code == 200:
                    created_category = response.json()
                    category_id = created_category.get("_id")
                    self.log_test("Create Category", True, f"Created category with ID: {category_id}")
                    
                    # Test GET specific category
                    response = self.session.get(f"{API_URL}/categories/{category_id}")
                    if response.status_code == 200:
                        self.log_test("Get Specific Category", True, "Category retrieved successfully")
                        
                        # Test DELETE category
                        response = self.session.delete(f"{API_URL}/categories/{category_id}")
                        if response.status_code == 200:
                            self.log_test("Delete Category", True, "Category deleted successfully")
                            return True
                        else:
                            self.log_test("Delete Category", False, f"Status code: {response.status_code}", response.text)
                            return False
                    else:
                        self.log_test("Get Specific Category", False, f"Status code: {response.status_code}", response.text)
                        return False
                else:
                    self.log_test("Create Category", False, f"Status code: {response.status_code}", response.text)
                    return False
            else:
                self.log_test("Get Categories", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Categories CRUD", False, f"Error: {str(e)}")
            return False
    
    def test_services_crud(self):
        """Test additional services CRUD operations"""
        if not self.auth_token:
            self.log_test("Services CRUD", False, "No auth token available")
            return False
            
        try:
            # Test GET services
            response = self.session.get(f"{API_URL}/services")
            
            if response.status_code == 200:
                services = response.json()
                self.log_test("Get Services", True, f"Found {len(services)} services")
                
                # Test POST new service
                new_service = {
                    "serviceId": "test_service",
                    "categoryId": "umzug",
                    "name": {
                        "de": "Test Service",
                        "en": "Test Service"
                    },
                    "description": {
                        "de": "Test Beschreibung",
                        "en": "Test Description"
                    },
                    "price": 150.0,
                    "priceType": "fixed",
                    "active": True,
                    "order": 10
                }
                
                response = self.session.post(f"{API_URL}/services", json=new_service)
                
                if response.status_code == 200:
                    created_service = response.json()
                    service_id = created_service.get("_id")
                    self.log_test("Create Service", True, f"Created service with ID: {service_id}")
                    
                    # Test GET specific service
                    response = self.session.get(f"{API_URL}/services/{service_id}")
                    if response.status_code == 200:
                        self.log_test("Get Specific Service", True, "Service retrieved successfully")
                        
                        # Test DELETE service
                        response = self.session.delete(f"{API_URL}/services/{service_id}")
                        if response.status_code == 200:
                            self.log_test("Delete Service", True, "Service deleted successfully")
                            return True
                        else:
                            self.log_test("Delete Service", False, f"Status code: {response.status_code}", response.text)
                            return False
                    else:
                        self.log_test("Get Specific Service", False, f"Status code: {response.status_code}", response.text)
                        return False
                else:
                    self.log_test("Create Service", False, f"Status code: {response.status_code}", response.text)
                    return False
            else:
                self.log_test("Get Services", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Services CRUD", False, f"Error: {str(e)}")
            return False
    
    def test_customers_crud(self):
        """Test customers CRUD operations"""
        if not self.auth_token:
            self.log_test("Customers CRUD", False, "No auth token available")
            return False
            
        try:
            # Test GET next customer number
            response = self.session.get(f"{API_URL}/customers/next-number")
            
            if response.status_code == 200:
                next_number_data = response.json()
                next_number = next_number_data.get("nextCustomerNumber")
                self.log_test("Get Next Customer Number", True, f"Next number: {next_number}")
                
                # Test GET customers
                response = self.session.get(f"{API_URL}/customers")
                
                if response.status_code == 200:
                    customers = response.json()
                    self.log_test("Get Customers", True, f"Found {len(customers)} customers")
                    
                    # Test POST new customer
                    new_customer = {
                        "salutation": "Herr",
                        "firstName": "Max",
                        "lastName": "Mustermann",
                        "email": "max.mustermann@example.com",
                        "phone": "+41 79 123 45 67",
                        "address": {
                            "street": "Musterstrasse 123",
                            "city": "Zürich",
                            "zipCode": "8001",
                            "country": "CH"
                        },
                        "notes": "Test customer"
                    }
                    
                    response = self.session.post(f"{API_URL}/customers", json=new_customer)
                    
                    if response.status_code == 200:
                        created_customer = response.json()
                        customer_id = created_customer.get("_id")
                        customer_number = created_customer.get("customerNumber")
                        self.log_test("Create Customer", True, f"Created customer {customer_number} with ID: {customer_id}")
                        
                        # Test GET specific customer
                        response = self.session.get(f"{API_URL}/customers/{customer_id}")
                        if response.status_code == 200:
                            self.log_test("Get Specific Customer", True, "Customer retrieved successfully")
                            
                            # Test PUT update customer
                            update_data = {
                                "firstName": "Max Updated",
                                "phone": "+41 79 999 88 77"
                            }
                            
                            response = self.session.put(f"{API_URL}/customers/{customer_id}", json=update_data)
                            if response.status_code == 200:
                                self.log_test("Update Customer", True, "Customer updated successfully")
                                
                                # Test DELETE customer
                                response = self.session.delete(f"{API_URL}/customers/{customer_id}")
                                if response.status_code == 200:
                                    self.log_test("Delete Customer", True, "Customer deleted successfully")
                                    return True
                                else:
                                    self.log_test("Delete Customer", False, f"Status code: {response.status_code}", response.text)
                                    return False
                            else:
                                self.log_test("Update Customer", False, f"Status code: {response.status_code}", response.text)
                                return False
                        else:
                            self.log_test("Get Specific Customer", False, f"Status code: {response.status_code}", response.text)
                            return False
                    else:
                        self.log_test("Create Customer", False, f"Status code: {response.status_code}", response.text)
                        return False
                else:
                    self.log_test("Get Customers", False, f"Status code: {response.status_code}", response.text)
                    return False
            else:
                self.log_test("Get Next Customer Number", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Customers CRUD", False, f"Error: {str(e)}")
            return False
    
    def test_offers_crud(self):
        """Test offers CRUD operations"""
        if not self.auth_token:
            self.log_test("Offers CRUD", False, "No auth token available")
            return False
            
        try:
            # Test GET next offer number
            response = self.session.get(f"{API_URL}/offers/next-number")
            
            if response.status_code == 200:
                next_number_data = response.json()
                next_number = next_number_data.get("nextOfferNumber")
                self.log_test("Get Next Offer Number", True, f"Next number: {next_number}")
                
                # Test GET offers
                response = self.session.get(f"{API_URL}/offers")
                
                if response.status_code == 200:
                    offers = response.json()
                    self.log_test("Get Offers", True, f"Found {len(offers)} offers")
                    
                    # Test POST new offer
                    new_offer = {
                        "offerNumber": next_number,
                        "category": "umzug",
                        "language": "de",
                        "customer": {
                            "salutation": "Herr",
                            "firstName": "Test",
                            "lastName": "Customer",
                            "email": "test@example.com",
                            "phone": "+41 79 123 45 67"
                        },
                        "currentLocation": {
                            "street": "Test Strasse 1",
                            "zipCode": "8001",
                            "city": "Zürich",
                            "floor": 2,
                            "hasElevator": True,
                            "distance": 0.0
                        },
                        "newLocation": {
                            "street": "Neue Strasse 2",
                            "zipCode": "8002",
                            "city": "Zürich",
                            "floor": 1,
                            "hasElevator": False,
                            "distance": 5.2
                        },
                        "serviceDetails": {
                            "movingDate": "2024-02-15",
                            "startTime": "08:00",
                            "object": "3.5 Zimmer Wohnung",
                            "workers": 3,
                            "trucks": 1,
                            "boxes": 20,
                            "assembly": True
                        },
                        "additionalServices": [],
                        "pricing": {
                            "basePrice": 1200.0,
                            "currency": "CHF",
                            "taxRate": 7.7,
                            "includeTax": True
                        },
                        "notes": "Test offer for moving service"
                    }
                    
                    response = self.session.post(f"{API_URL}/offers", json=new_offer)
                    
                    if response.status_code == 200:
                        created_offer = response.json()
                        offer_id = created_offer.get("_id")
                        offer_number = created_offer.get("offerNumber")
                        self.log_test("Create Offer", True, f"Created offer {offer_number} with ID: {offer_id}")
                        
                        # Test GET specific offer
                        response = self.session.get(f"{API_URL}/offers/{offer_id}")
                        if response.status_code == 200:
                            self.log_test("Get Specific Offer", True, "Offer retrieved successfully")
                            
                            # Test PUT update offer
                            update_data = {
                                "title": "Updated Test Offer",
                                "description": "Updated description"
                            }
                            
                            response = self.session.put(f"{API_URL}/offers/{offer_id}", json=update_data)
                            if response.status_code == 200:
                                self.log_test("Update Offer", True, "Offer updated successfully")
                                
                                # Test DELETE offer
                                response = self.session.delete(f"{API_URL}/offers/{offer_id}")
                                if response.status_code == 200:
                                    self.log_test("Delete Offer", True, "Offer deleted successfully")
                                    return True
                                else:
                                    self.log_test("Delete Offer", False, f"Status code: {response.status_code}", response.text)
                                    return False
                            else:
                                self.log_test("Update Offer", False, f"Status code: {response.status_code}", response.text)
                                return False
                        else:
                            self.log_test("Get Specific Offer", False, f"Status code: {response.status_code}", response.text)
                            return False
                    else:
                        self.log_test("Create Offer", False, f"Status code: {response.status_code}", response.text)
                        return False
                else:
                    self.log_test("Get Offers", False, f"Status code: {response.status_code}", response.text)
                    return False
            else:
                self.log_test("Get Next Offer Number", False, f"Status code: {response.status_code}", response.text)
                return False
        except Exception as e:
            self.log_test("Offers CRUD", False, f"Error: {str(e)}")
            return False
    
    def test_database_connectivity(self):
        """Test database connectivity by checking if data persists"""
        if not self.auth_token:
            self.log_test("Database Connectivity", False, "No auth token available")
            return False
            
        try:
            # Test by getting categories (should have default data)
            response = self.session.get(f"{API_URL}/categories")
            
            if response.status_code == 200:
                categories = response.json()
                if len(categories) > 0:
                    # Check if we have expected default categories
                    category_ids = [cat.get("categoryId") for cat in categories]
                    expected_categories = ["umzug", "moebeltransport", "reinigung"]
                    
                    found_categories = [cat_id for cat_id in expected_categories if cat_id in category_ids]
                    
                    if len(found_categories) >= 2:  # At least 2 default categories should exist
                        self.log_test("Database Connectivity", True, f"Database connected, found {len(categories)} categories")
                        return True
                    else:
                        self.log_test("Database Connectivity", False, f"Missing default categories. Found: {category_ids}")
                        return False
                else:
                    self.log_test("Database Connectivity", False, "No categories found in database")
                    return False
            else:
                self.log_test("Database Connectivity", False, f"Cannot access database. Status code: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Database Connectivity", False, f"Database connection error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"\n🧪 Starting Backend API Tests")
        print(f"🌐 Testing API at: {API_URL}")
        print("=" * 60)
        
        # Core tests in order
        tests = [
            ("API Health Check", self.test_health_check),
            ("Authentication", self.test_authentication),
            ("Get Current User", self.test_get_current_user),
            ("Company Settings", self.test_company_settings),
            ("Database Connectivity", self.test_database_connectivity),
            ("Categories CRUD", self.test_categories_crud),
            ("Services CRUD", self.test_services_crud),
            ("Customers CRUD", self.test_customers_crud),
            ("Offers CRUD", self.test_offers_crud),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            print(f"\n🔍 Running: {test_name}")
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_test(test_name, False, f"Unexpected error: {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {passed}/{total} tests passed")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"   - {test}")
        
        if passed == total:
            print("\n✅ All backend tests passed!")
            return True
        else:
            print(f"\n⚠️  {total - passed} tests failed")
            return False

def main():
    """Main test runner"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Return appropriate exit code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
