import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationExtras } from '@angular/router';

import { of, Observable } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { UserToken } from '../models/token-types.model';
import { RoutingService } from '../../routing/facade/routing.service';
import { AuthService } from '../facade/auth.service';
import { UrlCommands } from '../../routing/configurable-routes/url-translation/url-command';
import { AuthRedirectService } from './auth-redirect.service';

const mockUserToken = {
  access_token: 'Mock Access Token',
  token_type: 'test',
  refresh_token: 'test',
  expires_in: 1,
  scope: ['test'],
  userId: 'test',
} as UserToken;

class AuthServiceStub {
  getUserToken(): Observable<UserToken> {
    return of();
  }
}
class RoutingServiceStub {
  go(_path: any[] | UrlCommands, _query?: object, _extras?: NavigationExtras) {}
}

class MockAuthRedirectService {
  reportAuthGuard = jasmine.createSpy('reportAuthGuard');
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let service: RoutingService;
  let authService: AuthService;
  let authRedirectService: AuthRedirectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RoutingService,
          useClass: RoutingServiceStub,
        },
        {
          provide: AuthService,
          useClass: AuthServiceStub,
        },
        {
          provide: AuthRedirectService,
          useClass: MockAuthRedirectService,
        },
      ],
      imports: [RouterTestingModule],
    });
    guard = TestBed.get(AuthGuard);
    service = TestBed.get(RoutingService);
    authService = TestBed.get(AuthService);
    authRedirectService = TestBed.get(AuthRedirectService);

    spyOn(service, 'go').and.stub();
  });

  describe(', when user is NOT authorized,', () => {
    beforeEach(() => {
      spyOn(authService, 'getUserToken').and.returnValue(
        of({ access_token: undefined } as UserToken)
      );
    });

    it('should return false', () => {
      let result: boolean;
      guard
        .canActivate()
        .subscribe(value => (result = value))
        .unsubscribe();
      expect(result).toBe(false);
    });

    it('should notify AuthRedirectService with the current navigation', () => {
      guard
        .canActivate()
        .subscribe()
        .unsubscribe();
      expect(authRedirectService.reportAuthGuard).toHaveBeenCalled();
    });
  });

  describe(', when user is authorized,', () => {
    beforeEach(() => {
      spyOn(authService, 'getUserToken').and.returnValue(of(mockUserToken));
    });

    it('should return true', () => {
      let result: boolean;
      guard
        .canActivate()
        .subscribe(value => (result = value))
        .unsubscribe();
      expect(result).toBe(true);
    });
  });
});
