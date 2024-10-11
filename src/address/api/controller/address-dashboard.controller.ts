import { AuthenticatedController } from 'package/decorator/authentication/authenticated-controller.decorator';

@AuthenticatedController({
  controller: 'address',
})
export class AddressDashboardController {
  constructor() {}
}
