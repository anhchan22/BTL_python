from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from .models import UserProfile, IndustrialZone, RentalRequest, Contract
from decimal import Decimal


class ContractModelTestCase(TestCase):
    """Test Contract model functionality"""

    def setUp(self):
        """Set up test data"""
        # Create admin user
        self.admin_user = User.objects.create_user(
            username='admin',
            password='adminpass123',
            email='admin@test.com'
        )
        self.admin_user.profile.role = 'ADMIN'
        self.admin_user.profile.save()

        # Create tenant user
        self.tenant_user = User.objects.create_user(
            username='tenant1',
            password='tenantpass123',
            email='tenant@test.com'
        )
        self.tenant_user.profile.role = 'TENANT'
        self.tenant_user.profile.save()

        # Create industrial zone
        self.zone = IndustrialZone.objects.create(
            name='Zone A',
            location='Ha Noi',
            total_area=Decimal('10000.00'),
            available_area=Decimal('5000.00'),
            price_per_sqm=Decimal('500.00'),
            description='Test zone'
        )

        # Create rental request
        self.rental_request = RentalRequest.objects.create(
            tenant=self.tenant_user,
            zone=self.zone,
            requested_area=Decimal('1000.00'),
            rental_duration=12,
            status='APPROVED'
        )

    def test_contract_creation(self):
        """Test contract can be created with valid data"""
        contract_number = Contract.generate_contract_number()
        start_date = date.today()
        end_date = start_date + relativedelta(months=12)

        contract = Contract.objects.create(
            rental_request=self.rental_request,
            contract_number=contract_number,
            tenant=self.tenant_user,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=Decimal('500000.00'),
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        self.assertEqual(contract.tenant, self.tenant_user)
        self.assertEqual(contract.zone, self.zone)
        self.assertEqual(contract.status, 'ACTIVE')
        self.assertTrue(contract.contract_number.startswith('CNT-'))

    def test_contract_number_generation(self):
        """Test contract number is unique and correctly formatted"""
        num1 = Contract.generate_contract_number()
        num2 = Contract.generate_contract_number()

        self.assertNotEqual(num1, num2)
        self.assertTrue(num1.startswith('CNT-'))
        self.assertTrue(num2.startswith('CNT-'))
        self.assertEqual(len(num1.split('-')), 3)  # CNT-YEAR-RANDOM

    def test_contract_duration_calculation(self):
        """Test contract duration_months property"""
        contract_number = Contract.generate_contract_number()
        start_date = date.today()
        end_date = start_date + relativedelta(months=12)

        contract = Contract.objects.create(
            rental_request=self.rental_request,
            contract_number=contract_number,
            tenant=self.tenant_user,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=Decimal('500000.00'),
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        self.assertEqual(contract.duration_months, 12)

    def test_contract_total_value_calculation(self):
        """Test total contract value calculation"""
        contract_number = Contract.generate_contract_number()
        monthly_rent = Decimal('500000.00')
        duration = 12
        start_date = date.today()
        end_date = start_date + relativedelta(months=duration)

        contract = Contract.objects.create(
            rental_request=self.rental_request,
            contract_number=contract_number,
            tenant=self.tenant_user,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=monthly_rent,
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        expected_total = monthly_rent * duration
        self.assertEqual(contract.total_value, expected_total)

    def test_contract_is_active_property(self):
        """Test is_active property logic"""
        contract_number = Contract.generate_contract_number()
        start_date = date.today()
        end_date = date.today() + relativedelta(months=12)

        contract = Contract.objects.create(
            rental_request=self.rental_request,
            contract_number=contract_number,
            tenant=self.tenant_user,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=Decimal('500000.00'),
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        self.assertTrue(contract.is_active)

        # Test expired contract
        contract.status = 'EXPIRED'
        self.assertFalse(contract.is_active)

    def test_contract_days_remaining(self):
        """Test days remaining calculation"""
        contract_number = Contract.generate_contract_number()
        start_date = date.today()
        end_date = date.today() + timedelta(days=30)

        contract = Contract.objects.create(
            rental_request=self.rental_request,
            contract_number=contract_number,
            tenant=self.tenant_user,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=Decimal('500000.00'),
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        days_remaining = contract.days_remaining
        self.assertEqual(days_remaining, 30)

    def test_date_calculation_accuracy(self):
        """Test that start + duration = end date correctly"""
        contract_number = Contract.generate_contract_number()
        start_date = date(2026, 4, 8)
        duration = 6
        end_date = start_date + relativedelta(months=duration)

        contract = Contract.objects.create(
            rental_request=self.rental_request,
            contract_number=contract_number,
            tenant=self.tenant_user,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=Decimal('500000.00'),
            start_date=start_date,
            end_date=end_date,
            status='ACTIVE'
        )

        # Verify end date is exactly 6 months after start
        expected_end = date(2026, 10, 8)
        self.assertEqual(contract.end_date, expected_end)


class ContractAPITestCase(APITestCase):
    """Test Contract API endpoints"""

    def setUp(self):
        """Set up test data and client"""
        self.client = APIClient()

        # Create admin user
        self.admin_user = User.objects.create_user(
            username='admin',
            password='adminpass123',
            email='admin@test.com'
        )
        self.admin_user.profile.role = 'ADMIN'
        self.admin_user.profile.save()

        # Create two tenant users
        self.tenant1 = User.objects.create_user(
            username='tenant1',
            password='tenantpass123',
            email='tenant1@test.com'
        )
        self.tenant1.profile.role = 'TENANT'
        self.tenant1.profile.save()

        self.tenant2 = User.objects.create_user(
            username='tenant2',
            password='tenantpass123',
            email='tenant2@test.com'
        )
        self.tenant2.profile.role = 'TENANT'
        self.tenant2.profile.save()

        # Create industrial zone
        self.zone = IndustrialZone.objects.create(
            name='Zone A',
            location='Ha Noi',
            total_area=Decimal('10000.00'),
            available_area=Decimal('5000.00'),
            price_per_sqm=Decimal('500.00'),
            description='Test zone'
        )

        # Create rental requests for tenant1
        self.rental_request1 = RentalRequest.objects.create(
            tenant=self.tenant1,
            zone=self.zone,
            requested_area=Decimal('1000.00'),
            rental_duration=12,
            status='APPROVED'
        )

        self.rental_request2 = RentalRequest.objects.create(
            tenant=self.tenant1,
            zone=self.zone,
            requested_area=Decimal('500.00'),
            rental_duration=6,
            status='APPROVED'
        )

        # Create rental request for tenant2
        self.rental_request3 = RentalRequest.objects.create(
            tenant=self.tenant2,
            zone=self.zone,
            requested_area=Decimal('800.00'),
            rental_duration=24,
            status='APPROVED'
        )

        # Create contracts
        start_date = date.today()
        self.contract1 = Contract.objects.create(
            rental_request=self.rental_request1,
            contract_number=Contract.generate_contract_number(),
            tenant=self.tenant1,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=Decimal('500000.00'),
            start_date=start_date,
            end_date=start_date + relativedelta(months=12),
            status='ACTIVE'
        )

        self.contract2 = Contract.objects.create(
            rental_request=self.rental_request2,
            contract_number=Contract.generate_contract_number(),
            tenant=self.tenant1,
            zone=self.zone,
            area=Decimal('500.00'),
            monthly_rent=Decimal('250000.00'),
            start_date=start_date - timedelta(days=365),
            end_date=start_date - timedelta(days=1),
            status='EXPIRED'
        )

        self.contract3 = Contract.objects.create(
            rental_request=self.rental_request3,
            contract_number=Contract.generate_contract_number(),
            tenant=self.tenant2,
            zone=self.zone,
            area=Decimal('800.00'),
            monthly_rent=Decimal('400000.00'),
            start_date=start_date,
            end_date=start_date + relativedelta(months=24),
            status='ACTIVE'
        )

    def test_list_contracts_as_tenant(self):
        """Test tenant can see only their own contracts"""
        self.client.force_authenticate(user=self.tenant1)
        response = self.client.get('/api/contracts/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if isinstance(response.data, dict) else response.data
        self.assertEqual(len(results), 2)

        contract_ids = [c['id'] for c in results]
        self.assertIn(self.contract1.id, contract_ids)
        self.assertIn(self.contract2.id, contract_ids)
        self.assertNotIn(self.contract3.id, contract_ids)

    def test_list_contracts_as_admin(self):
        """Test admin can see all contracts"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/contracts/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if isinstance(response.data, dict) else response.data
        self.assertEqual(len(results), 3)

    def test_contract_detail_as_owner(self):
        """Test tenant can view their own contract detail"""
        self.client.force_authenticate(user=self.tenant1)
        response = self.client.get(f'/api/contracts/{self.contract1.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['contract_number'], self.contract1.contract_number)
        self.assertEqual(response.data['tenant'], self.tenant1.id)

    def test_contract_detail_as_non_owner(self):
        """Test tenant cannot view other tenant's contract"""
        self.client.force_authenticate(user=self.tenant2)
        response = self.client.get(f'/api/contracts/{self.contract1.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_contract_detail_as_admin(self):
        """Test admin can view any contract"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/contracts/{self.contract1.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_my_active_contracts(self):
        """Test tenant can get only their active contracts"""
        self.client.force_authenticate(user=self.tenant1)
        response = self.client.get('/api/contracts/my_active/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.contract1.id)
        self.assertEqual(response.data[0]['status'], 'ACTIVE')

    def test_get_all_active_contracts_as_admin(self):
        """Test admin can get all active contracts"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/contracts/active/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        contract_ids = [c['id'] for c in response.data]
        self.assertIn(self.contract1.id, contract_ids)
        self.assertIn(self.contract3.id, contract_ids)

    def test_get_all_active_contracts_as_tenant_forbidden(self):
        """Test tenant cannot access active contracts endpoint"""
        self.client.force_authenticate(user=self.tenant1)
        response = self.client.get('/api/contracts/active/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_contract_serializer_fields(self):
        """Test contract serializer includes all required fields"""
        self.client.force_authenticate(user=self.tenant1)
        response = self.client.get(f'/api/contracts/{self.contract1.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        required_fields = [
            'id', 'contract_number', 'rental_request_id', 'tenant',
            'tenant_info', 'zone', 'zone_info', 'area', 'monthly_rent',
            'start_date', 'end_date', 'status', 'duration_months',
            'total_value', 'is_active', 'days_remaining', 'created_at'
        ]

        for field in required_fields:
            self.assertIn(field, response.data)


class ContractAutoCreationTestCase(APITestCase):
    """Test contract auto-creation on rental request approval"""

    def setUp(self):
        """Set up test data"""
        self.client = APIClient()

        # Create admin and tenant
        self.admin = User.objects.create_user(
            username='admin',
            password='adminpass123',
            email='admin@test.com'
        )
        self.admin.profile.role = 'ADMIN'
        self.admin.profile.save()

        self.tenant = User.objects.create_user(
            username='tenant',
            password='tenantpass123',
            email='tenant@test.com'
        )
        self.tenant.profile.role = 'TENANT'
        self.tenant.profile.save()

        # Create zone
        self.zone = IndustrialZone.objects.create(
            name='Zone A',
            location='Ha Noi',
            total_area=Decimal('10000.00'),
            available_area=Decimal('5000.00'),
            price_per_sqm=Decimal('500.00'),
            description='Test zone'
        )

    def test_contract_created_on_request_approval(self):
        """Test contract is auto-created when request is approved"""
        # Create pending rental request
        rental_request = RentalRequest.objects.create(
            tenant=self.tenant,
            zone=self.zone,
            requested_area=Decimal('1000.00'),
            rental_duration=12,
            status='PENDING'
        )

        # Verify no contract exists yet
        self.assertEqual(Contract.objects.filter(rental_request=rental_request).count(), 0)

        # Approve request
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            f'/api/rentals/{rental_request.id}/approve/',
            {'admin_note': 'Approved'}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify contract is created
        contract = Contract.objects.get(rental_request=rental_request)
        self.assertEqual(contract.tenant, self.tenant)
        self.assertEqual(contract.zone, self.zone)
        self.assertEqual(contract.area, Decimal('1000.00'))
        self.assertEqual(contract.status, 'ACTIVE')

    def test_contract_dates_calculated_correctly(self):
        """Test contract dates are calculated from approval"""
        rental_request = RentalRequest.objects.create(
            tenant=self.tenant,
            zone=self.zone,
            requested_area=Decimal('1000.00'),
            rental_duration=6,
            status='PENDING'
        )

        self.client.force_authenticate(user=self.admin)
        self.client.post(
            f'/api/rentals/{rental_request.id}/approve/',
            {'admin_note': 'Approved'}
        )

        contract = Contract.objects.get(rental_request=rental_request)
        start = contract.start_date
        end = contract.end_date

        # Calculate expected end date
        expected_end = start + relativedelta(months=6)
        self.assertEqual(end, expected_end)

    def test_contract_monthly_rent_set_from_request(self):
        """Test contract monthly rent is set from request's estimated cost"""
        rental_request = RentalRequest.objects.create(
            tenant=self.tenant,
            zone=self.zone,
            requested_area=Decimal('1000.00'),
            rental_duration=12,
            status='PENDING'
        )

        expected_monthly = Decimal('1000.00') * self.zone.price_per_sqm

        self.client.force_authenticate(user=self.admin)
        self.client.post(
            f'/api/rentals/{rental_request.id}/approve/',
            {'admin_note': 'Approved'}
        )

        contract = Contract.objects.get(rental_request=rental_request)
        self.assertEqual(contract.monthly_rent, expected_monthly)

    def test_contract_number_unique(self):
        """Test each contract has unique contract number"""
        req1 = RentalRequest.objects.create(
            tenant=self.tenant,
            zone=self.zone,
            requested_area=Decimal('500.00'),
            rental_duration=12,
            status='PENDING'
        )

        req2 = RentalRequest.objects.create(
            tenant=self.tenant,
            zone=self.zone,
            requested_area=Decimal('500.00'),
            rental_duration=12,
            status='PENDING'
        )

        self.client.force_authenticate(user=self.admin)
        self.client.post(f'/api/rentals/{req1.id}/approve/', {'admin_note': 'Approved'})
        self.client.post(f'/api/rentals/{req2.id}/approve/', {'admin_note': 'Approved'})

        contract1 = Contract.objects.get(rental_request=req1)
        contract2 = Contract.objects.get(rental_request=req2)

        self.assertNotEqual(contract1.contract_number, contract2.contract_number)

    def test_approval_updates_zone_available_area(self):
        """Test zone available area decreases after approval"""
        original_available = self.zone.available_area

        rental_request = RentalRequest.objects.create(
            tenant=self.tenant,
            zone=self.zone,
            requested_area=Decimal('1000.00'),
            rental_duration=12,
            status='PENDING'
        )

        self.client.force_authenticate(user=self.admin)
        self.client.post(
            f'/api/rentals/{rental_request.id}/approve/',
            {'admin_note': 'Approved'}
        )

        self.zone.refresh_from_db()
        self.assertEqual(
            self.zone.available_area,
            original_available - Decimal('1000.00')
        )


class ContractPermissionTestCase(APITestCase):
    """Test Contract permission checks"""

    def setUp(self):
        """Set up test data"""
        self.client = APIClient()

        # Create users
        self.admin = User.objects.create_user(
            username='admin',
            password='admin',
            email='admin@test.com'
        )
        self.admin.profile.role = 'ADMIN'
        self.admin.profile.save()

        self.tenant = User.objects.create_user(
            username='tenant',
            password='tenant',
            email='tenant@test.com'
        )
        self.tenant.profile.role = 'TENANT'
        self.tenant.profile.save()

        # Create zone and contract
        self.zone = IndustrialZone.objects.create(
            name='Zone A',
            location='Ha Noi',
            total_area=Decimal('10000.00'),
            available_area=Decimal('5000.00'),
            price_per_sqm=Decimal('500.00'),
            description='Test zone'
        )

        rental_req = RentalRequest.objects.create(
            tenant=self.tenant,
            zone=self.zone,
            requested_area=Decimal('1000.00'),
            rental_duration=12,
            status='APPROVED'
        )

        self.contract = Contract.objects.create(
            rental_request=rental_req,
            contract_number=Contract.generate_contract_number(),
            tenant=self.tenant,
            zone=self.zone,
            area=Decimal('1000.00'),
            monthly_rent=Decimal('500000.00'),
            start_date=date.today(),
            end_date=date.today() + relativedelta(months=12),
            status='ACTIVE'
        )

    def test_unauthenticated_cannot_access(self):
        """Test unauthenticated users cannot access contracts"""
        response = self.client.get('/api/contracts/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tenant_cannot_modify_contract(self):
        """Test tenant cannot modify contracts (read-only)"""
        self.client.force_authenticate(user=self.tenant)
        response = self.client.put(
            f'/api/contracts/{self.contract.id}/',
            {'status': 'TERMINATED'}
        )

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_admin_cannot_modify_contract(self):
        """Test admin cannot modify contracts (read-only)"""
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(
            f'/api/contracts/{self.contract.id}/',
            {'status': 'TERMINATED'}
        )

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
