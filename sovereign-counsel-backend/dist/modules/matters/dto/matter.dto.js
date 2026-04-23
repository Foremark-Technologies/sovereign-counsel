"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHearingDto = exports.AssignMatterUserDto = exports.UpdateMatterDto = exports.CreateMatterDto = exports.MatterVisibilityLevel = exports.MatterStatus = void 0;
const class_validator_1 = require("class-validator");
var MatterStatus;
(function (MatterStatus) {
    MatterStatus["DRAFT"] = "DRAFT";
    MatterStatus["OPEN"] = "OPEN";
    MatterStatus["ON_HOLD"] = "ON_HOLD";
    MatterStatus["CLOSED"] = "CLOSED";
    MatterStatus["ARCHIVED"] = "ARCHIVED";
})(MatterStatus || (exports.MatterStatus = MatterStatus = {}));
var MatterVisibilityLevel;
(function (MatterVisibilityLevel) {
    MatterVisibilityLevel["PRIVATE"] = "PRIVATE";
    MatterVisibilityLevel["TEAM"] = "TEAM";
    MatterVisibilityLevel["ORG"] = "ORG";
})(MatterVisibilityLevel || (exports.MatterVisibilityLevel = MatterVisibilityLevel = {}));
class CreateMatterDto {
}
exports.CreateMatterDto = CreateMatterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "matterTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "clientName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "practiceArea", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "clientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "court", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "nextHearingDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "nextDeadline", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(MatterVisibilityLevel),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMatterDto.prototype, "visibilityLevel", void 0);
class UpdateMatterDto {
}
exports.UpdateMatterDto = UpdateMatterDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMatterDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMatterDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(MatterStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMatterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMatterDto.prototype, "nextHearingDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMatterDto.prototype, "nextDeadline", void 0);
class AssignMatterUserDto {
}
exports.AssignMatterUserDto = AssignMatterUserDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignMatterUserDto.prototype, "matterId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AssignMatterUserDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AssignMatterUserDto.prototype, "role", void 0);
class CreateHearingDto {
}
exports.CreateHearingDto = CreateHearingDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHearingDto.prototype, "matterId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHearingDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHearingDto.prototype, "court", void 0);
